/// Module: siuuu
module siuuu::siuuu {
    use sui::coin::Coin;
    use sui::sui::SUI;
    use sui::balance::Balance;

    // Error codes
    const EInvalidMatchId: u64 = 0;
    const EInvalidBetType: u64 = 1;
    const EInsufficientAmount: u64 = 2;

    // Bet types
    const BET_TYPE_HOME: u8 = 1;
    const BET_TYPE_AWAY: u8 = 2;
    const BET_TYPE_DRAW: u8 = 3;

    // Struct to represent a single bet
    public struct Bet has copy, drop, store {
        id: u64,
        match_id: u64,
        bet_type: u8,
        amount: u64,
        bettor: address,
        timestamp: u64,
    }

    // Main betting contract object
    public struct BettingContract has key {
        id: sui::object::UID,
        bets: vector<Bet>,
        total_pool: Balance<SUI>,
        bet_counter: u64,
        transaction_ids: vector<vector<u8>>,
    }

    // Initialize the betting contract
    fun init(ctx: &mut sui::tx_context::TxContext) {
        let contract = BettingContract {
            id: sui::object::new(ctx),
            bets: std::vector::empty<Bet>(),
            total_pool: sui::balance::zero<SUI>(),
            bet_counter: 0,
            transaction_ids: std::vector::empty<vector<u8>>(),
        };
        sui::transfer::share_object(contract);
    }

    // Function that accepts: id, betType, enteredAmount
    public fun place_bet(
        contract: &mut BettingContract,
        id: u64,
        bet_type: u8,
        entered_amount: Coin<SUI>,
        ctx: &mut sui::tx_context::TxContext
    ) {
        // Validate match id (matches 0-8 based on fixture data)
        assert!(id <= 8, EInvalidMatchId);
        
        // Validate bet_type
        assert!(bet_type == BET_TYPE_HOME || bet_type == BET_TYPE_AWAY || bet_type == BET_TYPE_DRAW, EInvalidBetType);
        
        let amount = sui::coin::value(&entered_amount);
        assert!(amount > 0, EInsufficientAmount);

        // Create the bet
        let bet = Bet {
            id: contract.bet_counter,
            match_id: id,
            bet_type,
            amount,
            bettor: sui::tx_context::sender(ctx),
            timestamp: sui::tx_context::epoch(ctx),
        };

        // Add bet to the contract
        std::vector::push_back(&mut contract.bets, bet);
        
        // Add payment to the total pool
        let payment_balance = sui::coin::into_balance(entered_amount);
        sui::balance::join(&mut contract.total_pool, payment_balance);
        
        // Store transaction ID
        let tx_digest = sui::tx_context::digest(ctx);
        std::vector::push_back(&mut contract.transaction_ids, *tx_digest);
        
        // Increment bet counter
        contract.bet_counter = contract.bet_counter + 1;
    }

}
