// PlayGroundBoF.tsx
import React, { useEffect, useMemo, useState } from 'react'
import {
    useAccount,
    useChainId,
    useConnect,
    useDisconnect,
    useReadContract,
    useWaitForTransactionReceipt,
    useWriteContract,
} from 'wagmi'
import { injected } from 'wagmi/connectors'
import type { Abi } from 'viem'
import Layout from '@theme/Layout';
import { Address, erc20Abi, formatUnits, isAddress, parseUnits } from 'viem';

/** -------------------------------------------------------------------------
 *  0) Chain → token address map (typesafe, fixes TS7053)
 * --------------------------------------------------------------------------*/
const CONTRACT_BY_CHAIN = {
    1: '0x0000000000000000000000000000000000000000',        // <-- replace (mainnet)
    11155111: '0xdd5d36c9cce7893ebfc35c4390511281cab3da85', // <-- replace (sepolia)
} as const

type SupportedChainId = keyof typeof CONTRACT_BY_CHAIN
const isSupportedChainId = (n: number): n is SupportedChainId => n in CONTRACT_BY_CHAIN

/** -------------------------------------------------------------------------
 *  Small utilities
 * --------------------------------------------------------------------------*/
function cx(...xs: Array<string | false | undefined>) {
    return xs.filter(Boolean).join(' ')
}

async function copyToClipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text)
    } catch {
        const ta = document.createElement('textarea')
        ta.value = text
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        ta.remove()
    }
    // lightweight UX — Docusaurus has no toast by default
    alert('Copied')
}
/*
-------------------------------------------------------------------------
 *  1) Generic ContractFunctionForm — works for common ERC‑20 style funcs
 *      - mode="read" uses useReadContract
 *      - mode="write" uses useWriteContract + receipt tracking
 *      - Supports param types: address, uintint* (BigInt), bool, string
      - If `decimals` provided, numeric inputs are parsed via parseUnits
--------------------------------------------------------------------------
*/


type ContractFunctionFormProps = {
    abi: Abi
    address: Address
    functionName: string
    mode: 'read' | 'write'
    label?: string
    decimals?: number // used to parse human amounts for uint*/int* params
}

export function ContractFunctionForm(props: ContractFunctionFormProps) {
    const { abi, address, functionName, mode, label, decimals } = props

    // Resolve the ABI item
    const item = useMemo(() => abi.find((x) => x.type === 'function' && x.name === functionName), [abi, functionName])
    const inputs = (item && 'inputs' in item ? (item as any).inputs : []) as Array<{ name?: string; type: string }>

    // Local state per-arg (strings for text fields; boolean for bool)
    const [argsUI, setArgsUI] = useState<Array<string | boolean>>(() => inputs.map((i) => (i.type === 'bool' ? false : '')))

    useEffect(() => {
        // If ABI or function changes, reset inputs
        setArgsUI(inputs.map((i) => (i.type === 'bool' ? false : '')))
    }, [functionName])

    // Convert UI strings → actual args for viem
    const parsedArgs: any[] | undefined = useMemo(() => {
        try {
            return inputs.map((p, idx) => {
                const v = argsUI[idx]
                if (p.type === 'bool') return Boolean(v)
                if (p.type === 'address') {
                    if (!isAddress(String(v))) throw new Error(`Invalid address for param #${idx + 1}`)
                    return v as Address
                }
                if (/^u?int(8|16|32|64|128|256)?$/.test(p.type)) {
                    const s = String(v).trim()
                    if (!s) return BigInt(0)
                    // If decimals provided, treat UI as human-readable decimal amount
                    return decimals != null ? parseUnits(s as `${number}` as any, decimals) : BigInt(s)
                }
                // bytes*/string → pass raw
                return String(v)
            })
        } catch (e) {
            return undefined
        }
    }, [argsUI, inputs, decimals])

    // READ path
    const {
        data: readData,
        isFetching: readLoading,
        error: readError,
        refetch: refetchRead,
    } = useReadContract({
        address,
        abi,
        functionName: functionName as any,
        // // @ts-expect-error variadic args
        args: parsedArgs,
        query: { enabled: mode === 'read' && Boolean(parsedArgs || inputs.length === 0) },
    })

    // WRITE path
    const { writeContract, data: txHash, isPending: writePending, error: writeError, reset: resetWrite } = useWriteContract()

    const {
        isLoading: txLoading,
        isSuccess: txSuccess,
        isError: txError,
        data: receipt,
    } = useWaitForTransactionReceipt({ hash: txHash, query: { enabled: mode === 'write' && Boolean(txHash) } })

    // Handlers
    function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (mode === 'read') {
            refetchRead()
            return
        }
        if (!parsedArgs) {
            alert('Please fill the inputs correctly.')
            return
        }
        resetWrite()/*

-------------------------------------------------------------------------
 *  1) Generic ContractFunctionForm — works for common ERC‑20 style funcs
 *      - mode="read" uses useReadContract
 *      - mode="write" uses useWriteContract + receipt tracking
 *      - Supports param types: address, uintint* (BigInt), bool, string
      - If `decimals` provided, numeric inputs are parsed via parseUnits
--------------------------------------------------------------------------

*/

        writeContract({ address, abi, functionName: functionName as any, //// @ts-expect-error variadic
            args: parsedArgs })
    }

    return (
        <div className="card">
            <div className="card__header">
                <h3 className="margin-bottom--none">{label ?? functionName}</h3>
            </div>
            <div className="card__body">
                <form onSubmit={onSubmit}>
                    {inputs.length === 0 ? (
                        <div className="margin-bottom--sm"><em>No arguments</em></div>
                    ) : (
                        inputs.map((p, idx) => (
                            <div key={idx} className="margin-bottom--sm">
                                <label className="label">{p.name || `arg${idx + 1}`} <small>({p.type})</small></label>
                                {p.type === 'bool' ? (
                                    <input
                                        type="checkbox"
                                        className="checkbox"
                                        checked={Boolean(argsUI[idx])}
                                        onChange={(e) => setArgsUI((a) => a.map((x, i) => (i === idx ? e.target.checked : x)))}
                                    />
                                ) : (
                                    <input
                                        className="input"
                                        placeholder={p.type.startsWith('uint') || p.type.startsWith('int') ? 'e.g. 2.5' : p.type === 'address' ? '0x…' : ''}
                                        value={String(argsUI[idx] ?? '')}
                                        onChange={(e) => setArgsUI((a) => a.map((x, i) => (i === idx ? e.target.value : x)))}
                                    />
                                )}
                                {p.type === 'address' && argsUI[idx] && (
                                    isAddress(String(argsUI[idx])) ? (
                                        <small className="text--success">Address looks valid</small>
                                    ) : (
                                        <small className="text--danger">Invalid address</small>
                                    )
                                )}
                            </div>
                        ))
                    )}

                    <button className={cx('button', mode === 'write' ? 'button--primary' : 'button--secondary')} disabled={mode === 'write' && writePending}>
                        {mode === 'write' ? (writePending ? 'Confirm in wallet…' : 'Send Transaction') : readLoading ? 'Reading…' : 'Read'}
                    </button>

                    {mode === 'read' && (
                        <div className="margin-top--sm">
                            {readError ? (
                                <div className="text--danger">Error: {(readError as any)?.message || String(readError)}</div>
                            ) : (
                                <>
                                    <div className="margin-bottom--xs">Result:</div>
                                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{JSON.stringify(readData, null, 2)}</pre>
                                </>
                            )}
                        </div>
                    )}

                    {mode === 'write' && (
                        <div className="alert alert--secondary margin-top--sm" role="alert">
                            {txHash && (
                                <div className="margin-bottom--xs">
                                    Tx hash: <code style={{ wordBreak: 'break-all' }}>{txHash}</code>{' '}
                                    <button className="button button--sm button--secondary" type="button" onClick={() => copyToClipboard(txHash!)}>
                                        Copy
                                    </button>
                                </div>
                            )}
                            {txLoading && <div>Waiting for confirmation…</div>}
                            {txSuccess && <div className="text--success">Mined in block {receipt?.blockNumber?.toString?.() ?? '—'}</div>}
                            {txError && <div className="text--danger">Tx failed</div>}
                            {writeError && <div className="text--danger">Error: {writeError.message}</div>}
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

/** -------------------------------------------------------------------------
 *  2) BillsOfExchange Playground (generic hooks)
 *      - Reads symbol/decimals/balanceOf
 *      - Transfer (write)
 *      - Uses ContractFunctionForm under the hood for ERC‑20 funcs
 * --------------------------------------------------------------------------*/
export default function BillsOfExchangePlayground() {
    const { address, status } = useAccount()
    const chainId = useChainId()
    const { connect, isPending: isConnecting } = useConnect()
    const { disconnect } = useDisconnect()

    const tokenAddress: Address | undefined = chainId && isSupportedChainId(chainId) ? (CONTRACT_BY_CHAIN[chainId] as Address) : undefined

    const { data: decimals } = useReadContract({ address: tokenAddress, abi: erc20Abi, functionName: 'decimals', query: { enabled: Boolean(tokenAddress) } })
    const { data: symbol } = useReadContract({ address: tokenAddress, abi: erc20Abi, functionName: 'symbol', query: { enabled: Boolean(tokenAddress) } })
    const { data: myRawBalance, refetch: refetchMy } = useReadContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: { enabled: Boolean(tokenAddress && address) },
    })

    const myBalance = useMemo(() => (myRawBalance == null || decimals == null ? '—' : formatUnits(myRawBalance as bigint, decimals)), [myRawBalance, decimals])

    function requestConnect() {
        // Triggers MetaMask popup (connect or unlock)
        connect({ connector: injected() })
    }

    useEffect(() => {
        // If a tx mined in one of the child forms, we might want to refresh here via a custom event.
        // Left simple for clarity; child form refreshes its own display.
    }, [])

    return (
        <Layout title="PlayGround" description="Manage your tokens">
        <div className="container margin-vert--lg">
            <div className="row">
                <div className="col col--12">
                    <div className="card">
                        <div className="card__header">
                            <h2 className="margin-bottom--none">BillsOfExchange — ERC‑20 Playground</h2>
                            <p className="margin-bottom--none">
                                Chain: <strong>{chainId ?? '—'}</strong>{' '}
                                {tokenAddress ? (
                                    <>
                                        · Token: <code>{tokenAddress}</code>{' '}
                                        <button className="button button--sm button--secondary" onClick={() => copyToClipboard(tokenAddress)}>
                                            Copy
                                        </button>
                                    </>
                                ) : (
                                    '· No token for this chain'
                                )}
                            </p>
                        </div>
                        <div className="card__body">
                            <div className="row">
                                <div className="col col--5">
                                    <section className="margin-bottom--lg">
                                        <h3 className="margin-bottom--sm">Wallet</h3>
                                        <p className="margin-bottom--sm">Status: <strong>{status}</strong></p>
                                        {address ? (
                                            <div className="margin-bottom--sm">
                                                <div className="margin-bottom--xs">
                                                    Address: <code>{address}</code>{' '}
                                                    <button className="button button--sm button--secondary" onClick={() => copyToClipboard(address!)}>Copy</button>
                                                </div>
                                                <button className="button button--sm" onClick={() => disconnect()}>Disconnect</button>
                                            </div>
                                        ) : (
                                            <button className={cx('button button--primary', isConnecting && 'button--disabled')} onClick={requestConnect} disabled={isConnecting}>
                                                {isConnecting ? 'Connecting…' : 'Connect / Unlock MetaMask'}
                                            </button>
                                        )}

                                        <hr />

                                        <div>
                                            <div>Symbol: <strong>{symbol ?? '—'}</strong></div>
                                            <div>Decimals: <strong>{decimals ?? '—'}</strong></div>
                                            <div className="margin-top--sm">Your balance: <strong>{myBalance}</strong> {symbol ?? ''}</div>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="margin-bottom--sm">Read: balanceOf</h3>
                                        {tokenAddress && (
                                            <ContractFunctionForm
                                                abi={erc20Abi as Abi}
                                                address={tokenAddress}
                                                functionName="balanceOf"
                                                mode="read"
                                                label="balanceOf(address)"
                                            />
                                        )}
                                    </section>
                                </div>

                                <div className="col col--7">
                                    <section>
                                        <h3 className="margin-bottom--sm">Write: transfer</h3>
                                        {tokenAddress && (
                                            <ContractFunctionForm
                                                abi={erc20Abi as Abi}
                                                address={tokenAddress}
                                                functionName="transfer"
                                                mode="write"
                                                label="transfer(address to, uint256 amount)"
                                                decimals={typeof decimals === 'number' ? decimals : undefined}
                                            />
                                        )}
                                        <p className="margin-top--sm"><small>Note: Amount input accepts human units (e.g., 2.5) and will be converted using token <code>decimals</code>.</small></p>
                                    </section>
                                </div>
                            </div>

                            <hr className="margin-vert--lg" />
                            <details>
                                <summary>Using CLI‑generated hooks instead (example)</summary>
                                <div>
                                    <p>
                                        If your Wagmi CLI generated hooks like <code>useWriteBillsOfExchangeTransfer</code>, replace the write section with:
                                    </p>
                                    <pre>{`// import { useWriteBillsOfExchangeTransfer, useWaitForTransactionReceipt } from "@/generated" // ← adjust path
const { writeContract: writeBoE, data: txHash, isPending, error, reset } = useWriteBillsOfExchangeTransfer()
// ...
reset()
writeBoE({ args: [toAddress, amountBigInt] })
// receipt tracking stays the same with useWaitForTransactionReceipt({ hash: txHash })`}</pre>
                                    <p>
                                        The <code>reset</code> function clears previous mutation state so a subsequent call updates flags like <code>isPending</code> and <code>error</code> from a clean slate.
                                    </p>
                                </div>
                            </details>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </Layout>
    )
}
