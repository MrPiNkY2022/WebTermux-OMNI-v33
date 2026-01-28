// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract OmniNFT is ERC721Upgradeable, AccessControlUpgradeable, UUPSUpgradeable {
    string private _baseURIextended;
    bool public soulbound; // Non-transferable mode

    function initialize() public initializer {
        __ERC721_init("WEBTERMUX OMNI V33", "WTONFT");
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _baseURIextended = "ipfs://YOUR_CID/";
    }

    function mint(address to, uint256 tokenId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _safeMint(to, tokenId);
    }

    function setSoulbound(bool _soulbound) external onlyRole(DEFAULT_ADMIN_ROLE) {
        soulbound = _soulbound;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal override virtual {
        require(!soulbound || from == address(0), "Soulbound");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseURIextended;
    }

    function _authorizeUpgrade(address) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}
