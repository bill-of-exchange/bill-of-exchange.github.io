import type {ReactNode} from 'react';
import React from 'react';
import {Redirect} from '@docusaurus/router';

// The holder's page is now "My bills" at /wallet/; old links to /manage/ lead there.
export default function ManagePage(): ReactNode {
    return <Redirect to="/wallet/"/>;
}
