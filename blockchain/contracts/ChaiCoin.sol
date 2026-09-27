// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title ChaiCoin ($CHAI)
/// @notice ERC-20 token for the ChaiCoin community meme-token project.
/// @dev Fixed supply, minted exactly once in the constructor. There is no
///      `mint` function anywhere in this contract or its parents — the
///      total supply can never increase after deployment. `Ownable` is
///      included only so ownership can be transferred (e.g. to a Treasury
///      multisig) or renounced; the owner has no function in this contract
///      that can pause transfers, blacklist addresses, alter balances, or
///      move tokens belonging to another holder. Burning is available to
///      any holder via `ERC20Burnable` (`burn`/`burnFrom`), subject to
///      standard ERC-20 allowance rules. There is no transfer tax or
///      fee-on-transfer logic — every transfer moves exactly the amount
///      sent. See TOKENOMICS.md and DECISIONS.md in the repository root
///      for the full rationale behind these design choices.
contract ChaiCoin is ERC20, ERC20Burnable, Ownable {
    /// @notice Total fixed supply: 100,000,000,000 CHAI (100 billion), 18 decimals.
    uint256 public constant TOTAL_SUPPLY = 100_000_000_000 * 10 ** 18;

    /// @param initialHolder The address that receives the entire fixed
    ///        supply at deployment (expected to be the deployer/treasury
    ///        wallet, which will manually distribute per the allocation
    ///        table in TOKENOMICS.md in separate, human-approved
    ///        transactions). This contract does not encode that split.
    /// @param initialOwner The address set as the initial `Ownable` owner.
    ///        This is separate from `initialHolder` so token custody and
    ///        contract ownership can be assigned independently if desired;
    ///        in practice they will typically start out as the same
    ///        deployer address and ownership will later be transferred to
    ///        the Treasury multisig per TOKENOMICS.md.
    constructor(
        address initialHolder,
        address initialOwner
    ) ERC20("ChaiCoin", "CHAI") Ownable(initialOwner) {
        require(initialHolder != address(0), "ChaiCoin: initialHolder is zero address");
        _mint(initialHolder, TOTAL_SUPPLY);
    }

    // Intentionally no other functions. In particular: no mint(), no
    // pause(), no blacklist(), no setFee()/tax logic, and no owner-gated
    // function that touches balances or transfers. Ownable is retained
    // solely for `transferOwnership` / `renounceOwnership`.
}
