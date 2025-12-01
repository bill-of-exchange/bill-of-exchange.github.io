import type {ReactNode} from 'react';
import React from 'react';
import Layout from '@theme/Layout';
import ContractPage from "@site/src/components/contracts/ContractPage";

export default function ManagePage():ReactNode {
    return (
        <Layout title="Manage" description="Manage your tokens">
            <ContractPage
                // contractName={"Manage your bills of exchange"}
                contractDescription={"Manage your electronic bills of exchange"}
            />
        </Layout>
    );
};
