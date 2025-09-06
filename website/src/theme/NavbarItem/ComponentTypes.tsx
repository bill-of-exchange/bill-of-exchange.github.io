import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import ConnectButtons from "@site/src/components/wagmi/ConnectButtons";
import ChainSwitcher from "@site/src/components/wagmi/ChainSwitcher";

// see:
// https://github.com/facebook/docusaurus/issues/7227

export default {
    ...ComponentTypes,
    // (!!!) using the 'custom-' prefix is important: the config validation schema will only allow item types with this prefix.
    'custom-connectButtons': ConnectButtons,
    'custom-chainSwitcher': ChainSwitcher,
};