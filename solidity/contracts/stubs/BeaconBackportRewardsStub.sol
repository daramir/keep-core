pragma solidity ^0.5.17;

import "../BeaconBackportRewards.sol";

contract BeaconBackportRewardsStub is BeaconBackportRewards {
    constructor (
        uint256 _termLength,
        address _token,
        uint256 _firstIntervalStart,
        address _operatorContract,
        address _stakingContract,
        uint256 _lastEligibleGroup,
        uint256[] memory _excludedGroups
    ) public BeaconBackportRewards(
        _termLength,
        _token,
        _firstIntervalStart,
        _operatorContract,
        _stakingContract,
        _lastEligibleGroup,
        _excludedGroups
    ) {}

    function receiveReward(uint256 i) public {
        receiveReward(bytes32(i));
    }

    function reportTermination(uint256 i) public {
        reportTermination(bytes32(i));
    }

    function eligibleForReward(uint256 i) public view returns (bool) {
        return eligibleForReward(bytes32(i));
    }

    function eligibleButTerminatedWithUint(uint256 i) public view returns (bool) {
        return eligibleButTerminated(bytes32(i));
    }

    function rewardClaimedWithUint(uint256 i) public view returns (bool) {
        return rewardClaimed(bytes32(i));
    }

    function findEndpoint(uint256 i) public view returns (uint256) {
        return _findEndpoint(i);
    }

    function getKeepCount() public view returns (uint256) {
        return _getKeepCount();
    }

    function recognizedByFactory(uint256 i) public view returns (bool) {
        return _recognizedByFactory(bytes32(i));
    }

    function isExcluded(uint256 i) public view returns (bool) {
        return excludedGroups[i];
    }
}