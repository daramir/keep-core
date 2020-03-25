pragma solidity ^0.5.4;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./GrantStakingPolicy.sol";

/// @title PermissiveStakingPolicy
/// @dev A staking policy which allows the grantee to stake the entire grant,
/// regardless of its unlocking status.
contract PermissiveStakingPolicy is GrantStakingPolicy {
    using SafeMath for uint256;

    function getStakeableAmount (
        uint256 _now,
        uint256 amount,
        uint256 duration,
        uint256 start,
        uint256 cliff,
        uint256 withdrawn
    ) public view returns (uint256) {
        // Can always stake the entire remaining amount.
        return amount.sub(withdrawn);
    }
}