// Add imports
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

contract OmniNFT is ... , VRFConsumerBaseV2, KeeperCompatibleInterface {
    // VRF variables
    uint64 s_subscriptionId;
    address vrfCoordinator = 0x...; // Sepolia: 0x8103B0A8A...
    bytes32 keyHash = 0x...;
    uint32 callbackGasLimit = 100000;

    function requestRandomMint() external {
        requestId = COORDINATOR.requestRandomWords(...);
    }

    function fulfillRandomWords(...) internal override {
        // Mint with randomness
    }

    // Keeper for auto-rewards
    function checkUpkeep(...) external override returns (bool, bytes memory) {}
    function performUpkeep(...) external override {}
}
