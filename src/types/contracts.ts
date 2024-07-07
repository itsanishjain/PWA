import {
    createUseReadContract,
    createUseWriteContract,
    createUseSimulateContract,
    createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Droplet
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b)
 */
export const dropletAbi = [
    {
        type: 'event',
        inputs: [
            { name: 'owner', type: 'address', indexed: true },
            { name: 'spender', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
        ],
        name: 'Approval',
    },
    {
        type: 'event',
        inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
        ],
        name: 'Transfer',
    },
    {
        type: 'function',
        inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ type: 'bool' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'decimals',
        outputs: [{ type: 'uint8' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'name',
        outputs: [{ type: 'string' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'symbol',
        outputs: [{ type: 'string' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'totalSupply',
        outputs: [{ type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'recipient', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ type: 'bool' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'sender', type: 'address' },
            { name: 'recipient', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ type: 'bool' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'to', internalType: 'address', type: 'address' },
            { name: 'amount', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'mint',
        outputs: [],
        stateMutability: 'nonpayable',
    },
] as const

/**
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b)
 */
export const dropletAddress = {
    84532: '0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b',
} as const

/**
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b)
 */
export const dropletConfig = {
    address: dropletAddress,
    abi: dropletAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Pool
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const poolAbi = [
    { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
    {
        type: 'function',
        inputs: [],
        name: 'DEFAULT_ADMIN_ROLE',
        outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'WHITELISTED_HOST',
        outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'WHITELISTED_SPONSOR',
        outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'acceptOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'poolId', internalType: 'uint256', type: 'uint256' },
            { name: 'timeEnd', internalType: 'uint40', type: 'uint40' },
        ],
        name: 'changeEndTime',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'poolId', internalType: 'uint256', type: 'uint256' },
            { name: 'poolName', internalType: 'string', type: 'string' },
        ],
        name: 'changePoolName',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'poolId', internalType: 'uint256', type: 'uint256' },
            { name: 'timeStart', internalType: 'uint40', type: 'uint40' },
        ],
        name: 'changeStartTime',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'poolId', internalType: 'uint256', type: 'uint256' },
            { name: 'winner', internalType: 'address', type: 'address' },
        ],
        name: 'claimWinning',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'poolIds', internalType: 'uint256[]', type: 'uint256[]' },
            { name: '_winners', internalType: 'address[]', type: 'address[]' },
        ],
        name: 'claimWinnings',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: '', internalType: 'address', type: 'address' },
            { name: '', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'claimablePools',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'poolId', internalType: 'uint256', type: 'uint256' }],
        name: 'collectFees',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [{ name: 'poolId', internalType: 'uint256', type: 'uint256' }],
        name: 'collectRemainingBalance',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'timeStart', internalType: 'uint40', type: 'uint40' },
            { name: 'timeEnd', internalType: 'uint40', type: 'uint40' },
            { name: 'poolName', internalType: 'string', type: 'string' },
            {
                name: 'depositAmountPerPerson',
                internalType: 'uint256',
                type: 'uint256',
            },
            { name: 'penaltyFeeRate', internalType: 'uint16', type: 'uint16' },
            { name: 'token', internalType: 'address', type: 'address' },
        ],
        name: 'createPool',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: '', internalType: 'address', type: 'address' },
            { name: '', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'createdPools',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'poolId', internalType: 'uint256', type: 'uint256' }],
        name: 'deletePool',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'poolId', internalType: 'uint256', type: 'uint256' },
            { name: 'amount', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'deposit',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'token', internalType: 'contract IERC20', type: 'address' },
            { name: 'amount', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'emergencyWithdraw',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [{ name: 'poolId', internalType: 'uint256', type: 'uint256' }],
        name: 'enableDeposit',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [{ name: 'poolId', internalType: 'uint256', type: 'uint256' }],
        name: 'endPool',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'poolId', internalType: 'uint256', type: 'uint256' },
            { name: 'winner', internalType: 'address', type: 'address' },
        ],
        name: 'forfeitWinnings',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [{ name: 'poolId', internalType: 'uint256', type: 'uint256' }],
        name: 'getAllPoolInfo',
        outputs: [
            {
                name: '_poolAdmin',
                internalType: 'struct IPool.PoolAdmin',
                type: 'tuple',
                components: [
                    { name: 'host', internalType: 'address', type: 'address' },
                    { name: 'penaltyFeeRate', internalType: 'uint16', type: 'uint16' },
                ],
            },
            {
                name: '_poolDetail',
                internalType: 'struct IPool.PoolDetail',
                type: 'tuple',
                components: [
                    { name: 'timeStart', internalType: 'uint40', type: 'uint40' },
                    { name: 'timeEnd', internalType: 'uint40', type: 'uint40' },
                    { name: 'poolName', internalType: 'string', type: 'string' },
                    {
                        name: 'depositAmountPerPerson',
                        internalType: 'uint256',
                        type: 'uint256',
                    },
                ],
            },
            {
                name: '_poolBalance',
                internalType: 'struct IPool.PoolBalance',
                type: 'tuple',
                components: [
                    { name: 'totalDeposits', internalType: 'uint256', type: 'uint256' },
                    { name: 'feesAccumulated', internalType: 'uint256', type: 'uint256' },
                    { name: 'feesCollected', internalType: 'uint256', type: 'uint256' },
                    { name: 'balance', internalType: 'uint256', type: 'uint256' },
                    { name: 'sponsored', internalType: 'uint256', type: 'uint256' },
                ],
            },
            {
                name: '_poolStatus',
                internalType: 'enum IPool.POOLSTATUS',
                type: 'uint8',
            },
            { name: '_poolToken', internalType: 'address', type: 'address' },
            { name: '_participants', internalType: 'address[]', type: 'address[]' },
            { name: '_winners', internalType: 'address[]', type: 'address[]' },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'winner', internalType: 'address', type: 'address' }],
        name: 'getClaimablePools',
        outputs: [
            { name: '', internalType: 'uint256[]', type: 'uint256[]' },
            { name: '', internalType: 'bool[]', type: 'bool[]' },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'poolId', internalType: 'uint256', type: 'uint256' }],
        name: 'getFeesAccumulated',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'poolId', internalType: 'uint256', type: 'uint256' }],
        name: 'getFeesCollected',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'poolId', internalType: 'uint256', type: 'uint256' }],
        name: 'getHost',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'participant', internalType: 'address', type: 'address' },
            { name: 'poolId', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'getParticipantDeposit',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'participant', internalType: 'address', type: 'address' },
            { name: 'poolId', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'getParticipantDetail',
        outputs: [
            {
                name: '',
                internalType: 'struct IPool.ParticipantDetail',
                type: 'tuple',
                components: [
                    { name: 'deposit', internalType: 'uint256', type: 'uint256' },
                    { name: 'feesCharged', internalType: 'uint256', type: 'uint256' },
                    {
                        name: 'participantIndex',
                        internalType: 'uint120',
                        type: 'uint120',
                    },
                    {
                        name: 'joinedPoolsIndex',
                        internalType: 'uint120',
                        type: 'uint120',
                    },
                    { name: 'refunded', internalType: 'bool', type: 'bool' },
                ],
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'poolId', internalType: 'uint256', type: 'uint256' }],
        name: 'getParticipants',
        outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'poolId', internalType: 'uint256', type: 'uint256' }],
        name: 'getPoolBalance',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'poolId', internalType: 'uint256', type: 'uint256' }],
        name: 'getPoolDetail',
        outputs: [
            {
                name: '',
                internalType: 'struct IPool.PoolDetail',
                type: 'tuple',
                components: [
                    { name: 'timeStart', internalType: 'uint40', type: 'uint40' },
                    { name: 'timeEnd', internalType: 'uint40', type: 'uint40' },
                    { name: 'poolName', internalType: 'string', type: 'string' },
                    {
                        name: 'depositAmountPerPerson',
                        internalType: 'uint256',
                        type: 'uint256',
                    },
                ],
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'poolId', internalType: 'uint256', type: 'uint256' }],
        name: 'getPoolFeeRate',
        outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'host', internalType: 'address', type: 'address' }],
        name: 'getPoolsCreatedBy',
        outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'participant', internalType: 'address', type: 'address' }],
        name: 'getPoolsJoinedBy',
        outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
        name: 'getRoleAdmin',
        outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'poolId', internalType: 'uint256', type: 'uint256' },
            { name: '_sponsor', internalType: 'address', type: 'address' },
        ],
        name: 'getSponsorDetail',
        outputs: [
            {
                name: '',
                internalType: 'struct IPool.SponsorDetail',
                type: 'tuple',
                components: [
                    { name: 'name', internalType: 'string', type: 'string' },
                    { name: 'amount', internalType: 'uint256', type: 'uint256' },
                ],
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'poolId', internalType: 'uint256', type: 'uint256' }],
        name: 'getSponsors',
        outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'poolId', internalType: 'uint256', type: 'uint256' }],
        name: 'getSponsorshipAmount',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'poolId', internalType: 'uint256', type: 'uint256' },
            { name: 'winner', internalType: 'address', type: 'address' },
        ],
        name: 'getWinnerDetail',
        outputs: [
            {
                name: '',
                internalType: 'struct IPool.WinnerDetail',
                type: 'tuple',
                components: [
                    { name: 'amountWon', internalType: 'uint256', type: 'uint256' },
                    { name: 'amountClaimed', internalType: 'uint256', type: 'uint256' },
                    { name: 'timeWon', internalType: 'uint40', type: 'uint40' },
                    { name: 'claimed', internalType: 'bool', type: 'bool' },
                    { name: 'forfeited', internalType: 'bool', type: 'bool' },
                    { name: 'alreadyInList', internalType: 'bool', type: 'bool' },
                ],
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'poolId', internalType: 'uint256', type: 'uint256' }],
        name: 'getWinners',
        outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'poolId', internalType: 'uint256', type: 'uint256' }],
        name: 'getWinnersDetails',
        outputs: [
            { name: '', internalType: 'address[]', type: 'address[]' },
            {
                name: '',
                internalType: 'struct IPool.WinnerDetail[]',
                type: 'tuple[]',
                components: [
                    { name: 'amountWon', internalType: 'uint256', type: 'uint256' },
                    { name: 'amountClaimed', internalType: 'uint256', type: 'uint256' },
                    { name: 'timeWon', internalType: 'uint40', type: 'uint40' },
                    { name: 'claimed', internalType: 'bool', type: 'bool' },
                    { name: 'forfeited', internalType: 'bool', type: 'bool' },
                    { name: 'alreadyInList', internalType: 'bool', type: 'bool' },
                ],
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'poolId', internalType: 'uint256', type: 'uint256' },
            { name: 'winner', internalType: 'address', type: 'address' },
        ],
        name: 'getWinningAmount',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'role', internalType: 'bytes32', type: 'bytes32' },
            { name: 'account', internalType: 'address', type: 'address' },
        ],
        name: 'grantRole',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'role', internalType: 'bytes32', type: 'bytes32' },
            { name: 'account', internalType: 'address', type: 'address' },
        ],
        name: 'hasRole',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: '', internalType: 'address', type: 'address' },
            { name: 'poolId', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'isHost',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: '', internalType: 'address', type: 'address' },
            { name: 'poolId', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'isParticipant',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: '', internalType: 'address', type: 'address' },
            { name: '', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'joinedPools',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'latestPoolId',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'owner',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: '', internalType: 'address', type: 'address' },
            { name: 'poolId', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'participantDetail',
        outputs: [
            { name: 'deposit', internalType: 'uint256', type: 'uint256' },
            { name: 'feesCharged', internalType: 'uint256', type: 'uint256' },
            { name: 'participantIndex', internalType: 'uint120', type: 'uint120' },
            { name: 'joinedPoolsIndex', internalType: 'uint120', type: 'uint120' },
            { name: 'refunded', internalType: 'bool', type: 'bool' },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: '', internalType: 'uint256', type: 'uint256' },
            { name: '', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'participants',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'pause',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'paused',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'pendingOwner',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        name: 'poolAdmin',
        outputs: [
            { name: 'host', internalType: 'address', type: 'address' },
            { name: 'penaltyFeeRate', internalType: 'uint16', type: 'uint16' },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        name: 'poolBalance',
        outputs: [
            { name: 'totalDeposits', internalType: 'uint256', type: 'uint256' },
            { name: 'feesAccumulated', internalType: 'uint256', type: 'uint256' },
            { name: 'feesCollected', internalType: 'uint256', type: 'uint256' },
            { name: 'balance', internalType: 'uint256', type: 'uint256' },
            { name: 'sponsored', internalType: 'uint256', type: 'uint256' },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        name: 'poolDetail',
        outputs: [
            { name: 'timeStart', internalType: 'uint40', type: 'uint40' },
            { name: 'timeEnd', internalType: 'uint40', type: 'uint40' },
            { name: 'poolName', internalType: 'string', type: 'string' },
            {
                name: 'depositAmountPerPerson',
                internalType: 'uint256',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        name: 'poolStatus',
        outputs: [{ name: '', internalType: 'enum IPool.POOLSTATUS', type: 'uint8' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        name: 'poolToken',
        outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'poolId', internalType: 'uint256', type: 'uint256' }],
        name: 'reenableDeposit',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'poolId', internalType: 'uint256', type: 'uint256' },
            { name: 'participant', internalType: 'address', type: 'address' },
            { name: 'amount', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'refundParticipant',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'role', internalType: 'bytes32', type: 'bytes32' },
            { name: 'callerConfirmation', internalType: 'address', type: 'address' },
        ],
        name: 'renounceRole',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'role', internalType: 'bytes32', type: 'bytes32' },
            { name: 'account', internalType: 'address', type: 'address' },
        ],
        name: 'revokeRole',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [{ name: 'poolId', internalType: 'uint256', type: 'uint256' }],
        name: 'selfRefund',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'poolId', internalType: 'uint256', type: 'uint256' },
            { name: 'winner', internalType: 'address', type: 'address' },
            { name: 'amount', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'setWinner',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'poolId', internalType: 'uint256', type: 'uint256' },
            { name: '_winners', internalType: 'address[]', type: 'address[]' },
            { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
        ],
        name: 'setWinners',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'name', internalType: 'string', type: 'string' },
            { name: 'poolId', internalType: 'uint256', type: 'uint256' },
            { name: 'amount', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'sponsor',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: '', internalType: 'address', type: 'address' },
            { name: 'poolId', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'sponsorDetail',
        outputs: [
            { name: 'name', internalType: 'string', type: 'string' },
            { name: 'amount', internalType: 'uint256', type: 'uint256' },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: '', internalType: 'uint256', type: 'uint256' },
            { name: '', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'sponsors',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'poolId', internalType: 'uint256', type: 'uint256' }],
        name: 'startPool',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
        name: 'supportsInterface',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'unpause',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: '', internalType: 'address', type: 'address' },
            { name: 'poolId', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'winnerDetail',
        outputs: [
            { name: 'amountWon', internalType: 'uint256', type: 'uint256' },
            { name: 'amountClaimed', internalType: 'uint256', type: 'uint256' },
            { name: 'timeWon', internalType: 'uint40', type: 'uint40' },
            { name: 'claimed', internalType: 'bool', type: 'bool' },
            { name: 'forfeited', internalType: 'bool', type: 'bool' },
            { name: 'alreadyInList', internalType: 'bool', type: 'bool' },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: '', internalType: 'uint256', type: 'uint256' },
            { name: '', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'winners',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'poolId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'participant',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'amount',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'Deposit',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'poolId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'participant',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'amount',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'ExtraDeposit',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'poolId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'participant',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'fees',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'FeesCharged',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'poolId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            { name: 'host', internalType: 'address', type: 'address', indexed: true },
            {
                name: 'fees',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'FeesCollected',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'poolId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'participant',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
        ],
        name: 'JoinedPoolsRemoved',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'previousOwner',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'newOwner',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
        ],
        name: 'OwnershipTransferStarted',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'previousOwner',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'newOwner',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
        ],
        name: 'OwnershipTransferred',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'poolId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'participant',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
        ],
        name: 'ParticipantRejoined',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'poolId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'participant',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
        ],
        name: 'ParticipantRemoved',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'account',
                internalType: 'address',
                type: 'address',
                indexed: false,
            },
        ],
        name: 'Paused',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'poolId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'balanceBefore',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'balanceAfter',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'PoolBalanceUpdated',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'poolId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            { name: 'host', internalType: 'address', type: 'address', indexed: true },
            {
                name: 'poolName',
                internalType: 'string',
                type: 'string',
                indexed: false,
            },
            {
                name: 'depositAmountPerPerson',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'penaltyFeeRate',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'token',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
        ],
        name: 'PoolCreated',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'poolId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'endTime',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'PoolEndTimeChanged',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'poolId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'poolName',
                internalType: 'string',
                type: 'string',
                indexed: false,
            },
        ],
        name: 'PoolNameChanged',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'poolId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'startTime',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'PoolStartTimeChanged',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'poolId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'status',
                internalType: 'enum IPool.POOLSTATUS',
                type: 'uint8',
                indexed: false,
            },
        ],
        name: 'PoolStatusChanged',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'poolId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'participant',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'amount',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'Refund',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'poolId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            { name: 'host', internalType: 'address', type: 'address', indexed: true },
            {
                name: 'amount',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'RemainingBalanceCollected',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
            {
                name: 'previousAdminRole',
                internalType: 'bytes32',
                type: 'bytes32',
                indexed: true,
            },
            {
                name: 'newAdminRole',
                internalType: 'bytes32',
                type: 'bytes32',
                indexed: true,
            },
        ],
        name: 'RoleAdminChanged',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
            {
                name: 'account',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'sender',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
        ],
        name: 'RoleGranted',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
            {
                name: 'account',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'sender',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
        ],
        name: 'RoleRevoked',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'poolId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'sponsor',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'amount',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'SponsorshipAdded',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'account',
                internalType: 'address',
                type: 'address',
                indexed: false,
            },
        ],
        name: 'Unpaused',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'poolId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'winner',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'amount',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'WinnerSet',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'poolId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'winner',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'amount',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'WinningForfeited',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'poolId',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'winner',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'amount',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'WinningsClaimed',
    },
    { type: 'error', inputs: [], name: 'AccessControlBadConfirmation' },
    {
        type: 'error',
        inputs: [
            { name: 'account', internalType: 'address', type: 'address' },
            { name: 'neededRole', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'AccessControlUnauthorizedAccount',
    },
    { type: 'error', inputs: [], name: 'EnforcedPause' },
    {
        type: 'error',
        inputs: [
            { name: 'timeNow', internalType: 'uint256', type: 'uint256' },
            { name: 'timeStart', internalType: 'uint256', type: 'uint256' },
            { name: 'caller', internalType: 'address', type: 'address' },
        ],
        name: 'EventStarted',
    },
    { type: 'error', inputs: [], name: 'ExpectedPause' },
    {
        type: 'error',
        inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
        name: 'OwnableInvalidOwner',
    },
    {
        type: 'error',
        inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
        name: 'OwnableUnauthorizedAccount',
    },
    {
        type: 'error',
        inputs: [{ name: 'caller', internalType: 'address', type: 'address' }],
        name: 'Unauthorized',
    },
] as const

/**
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const poolAddress = {
    84532: '0x5C22662210E48D0f5614cACA6f7a6a938716Ea26',
} as const

/**
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const poolConfig = { address: poolAddress, abi: poolAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dropletAbi}__
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b)
 */
export const useReadDroplet = /*#__PURE__*/ createUseReadContract({
    abi: dropletAbi,
    address: dropletAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dropletAbi}__ and `functionName` set to `"allowance"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b)
 */
export const useReadDropletAllowance = /*#__PURE__*/ createUseReadContract({
    abi: dropletAbi,
    address: dropletAddress,
    functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dropletAbi}__ and `functionName` set to `"balanceOf"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b)
 */
export const useReadDropletBalanceOf = /*#__PURE__*/ createUseReadContract({
    abi: dropletAbi,
    address: dropletAddress,
    functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dropletAbi}__ and `functionName` set to `"decimals"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b)
 */
export const useReadDropletDecimals = /*#__PURE__*/ createUseReadContract({
    abi: dropletAbi,
    address: dropletAddress,
    functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dropletAbi}__ and `functionName` set to `"name"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b)
 */
export const useReadDropletName = /*#__PURE__*/ createUseReadContract({
    abi: dropletAbi,
    address: dropletAddress,
    functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dropletAbi}__ and `functionName` set to `"symbol"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b)
 */
export const useReadDropletSymbol = /*#__PURE__*/ createUseReadContract({
    abi: dropletAbi,
    address: dropletAddress,
    functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dropletAbi}__ and `functionName` set to `"totalSupply"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b)
 */
export const useReadDropletTotalSupply = /*#__PURE__*/ createUseReadContract({
    abi: dropletAbi,
    address: dropletAddress,
    functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dropletAbi}__
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b)
 */
export const useWriteDroplet = /*#__PURE__*/ createUseWriteContract({
    abi: dropletAbi,
    address: dropletAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dropletAbi}__ and `functionName` set to `"approve"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b)
 */
export const useWriteDropletApprove = /*#__PURE__*/ createUseWriteContract({
    abi: dropletAbi,
    address: dropletAddress,
    functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dropletAbi}__ and `functionName` set to `"transfer"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b)
 */
export const useWriteDropletTransfer = /*#__PURE__*/ createUseWriteContract({
    abi: dropletAbi,
    address: dropletAddress,
    functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dropletAbi}__ and `functionName` set to `"transferFrom"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b)
 */
export const useWriteDropletTransferFrom = /*#__PURE__*/ createUseWriteContract({
    abi: dropletAbi,
    address: dropletAddress,
    functionName: 'transferFrom',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dropletAbi}__ and `functionName` set to `"mint"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b)
 */
export const useWriteDropletMint = /*#__PURE__*/ createUseWriteContract({
    abi: dropletAbi,
    address: dropletAddress,
    functionName: 'mint',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dropletAbi}__
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b)
 */
export const useSimulateDroplet = /*#__PURE__*/ createUseSimulateContract({
    abi: dropletAbi,
    address: dropletAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dropletAbi}__ and `functionName` set to `"approve"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b)
 */
export const useSimulateDropletApprove = /*#__PURE__*/ createUseSimulateContract({
    abi: dropletAbi,
    address: dropletAddress,
    functionName: 'approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dropletAbi}__ and `functionName` set to `"transfer"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b)
 */
export const useSimulateDropletTransfer = /*#__PURE__*/ createUseSimulateContract({
    abi: dropletAbi,
    address: dropletAddress,
    functionName: 'transfer',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dropletAbi}__ and `functionName` set to `"transferFrom"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b)
 */
export const useSimulateDropletTransferFrom = /*#__PURE__*/ createUseSimulateContract({
    abi: dropletAbi,
    address: dropletAddress,
    functionName: 'transferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dropletAbi}__ and `functionName` set to `"mint"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b)
 */
export const useSimulateDropletMint = /*#__PURE__*/ createUseSimulateContract({
    abi: dropletAbi,
    address: dropletAddress,
    functionName: 'mint',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dropletAbi}__
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b)
 */
export const useWatchDropletEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: dropletAbi,
    address: dropletAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dropletAbi}__ and `eventName` set to `"Approval"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b)
 */
export const useWatchDropletApprovalEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: dropletAbi,
    address: dropletAddress,
    eventName: 'Approval',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dropletAbi}__ and `eventName` set to `"Transfer"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b)
 */
export const useWatchDropletTransferEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: dropletAbi,
    address: dropletAddress,
    eventName: 'Transfer',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPool = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolDefaultAdminRole = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'DEFAULT_ADMIN_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"WHITELISTED_HOST"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolWhitelistedHost = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'WHITELISTED_HOST',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"WHITELISTED_SPONSOR"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolWhitelistedSponsor = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'WHITELISTED_SPONSOR',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"claimablePools"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolClaimablePools = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'claimablePools',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"createdPools"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolCreatedPools = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'createdPools',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"getAllPoolInfo"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolGetAllPoolInfo = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'getAllPoolInfo',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"getClaimablePools"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolGetClaimablePools = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'getClaimablePools',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"getFeesAccumulated"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolGetFeesAccumulated = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'getFeesAccumulated',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"getFeesCollected"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolGetFeesCollected = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'getFeesCollected',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"getHost"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolGetHost = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'getHost',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"getParticipantDeposit"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolGetParticipantDeposit = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'getParticipantDeposit',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"getParticipantDetail"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolGetParticipantDetail = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'getParticipantDetail',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"getParticipants"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolGetParticipants = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'getParticipants',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"getPoolBalance"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolGetPoolBalance = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'getPoolBalance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"getPoolDetail"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolGetPoolDetail = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'getPoolDetail',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"getPoolFeeRate"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolGetPoolFeeRate = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'getPoolFeeRate',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"getPoolsCreatedBy"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolGetPoolsCreatedBy = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'getPoolsCreatedBy',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"getPoolsJoinedBy"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolGetPoolsJoinedBy = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'getPoolsJoinedBy',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"getRoleAdmin"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolGetRoleAdmin = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'getRoleAdmin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"getSponsorDetail"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolGetSponsorDetail = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'getSponsorDetail',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"getSponsors"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolGetSponsors = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'getSponsors',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"getSponsorshipAmount"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolGetSponsorshipAmount = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'getSponsorshipAmount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"getWinnerDetail"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolGetWinnerDetail = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'getWinnerDetail',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"getWinners"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolGetWinners = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'getWinners',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"getWinnersDetails"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolGetWinnersDetails = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'getWinnersDetails',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"getWinningAmount"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolGetWinningAmount = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'getWinningAmount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"hasRole"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolHasRole = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'hasRole',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"isHost"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolIsHost = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'isHost',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"isParticipant"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolIsParticipant = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'isParticipant',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"joinedPools"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolJoinedPools = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'joinedPools',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"latestPoolId"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolLatestPoolId = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'latestPoolId',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"owner"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolOwner = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"participantDetail"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolParticipantDetail = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'participantDetail',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"participants"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolParticipants = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'participants',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"paused"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolPaused = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'paused',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"pendingOwner"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolPendingOwner = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'pendingOwner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"poolAdmin"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolPoolAdmin = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'poolAdmin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"poolBalance"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolPoolBalance = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'poolBalance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"poolDetail"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolPoolDetail = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'poolDetail',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"poolStatus"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolPoolStatus = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'poolStatus',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"poolToken"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolPoolToken = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'poolToken',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"sponsorDetail"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolSponsorDetail = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'sponsorDetail',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"sponsors"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolSponsors = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'sponsors',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"supportsInterface"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolSupportsInterface = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'supportsInterface',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"winnerDetail"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolWinnerDetail = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'winnerDetail',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"winners"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useReadPoolWinners = /*#__PURE__*/ createUseReadContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'winners',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePool = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"acceptOwnership"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolAcceptOwnership = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'acceptOwnership',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"changeEndTime"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolChangeEndTime = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'changeEndTime',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"changePoolName"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolChangePoolName = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'changePoolName',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"changeStartTime"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolChangeStartTime = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'changeStartTime',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"claimWinning"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolClaimWinning = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'claimWinning',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"claimWinnings"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolClaimWinnings = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'claimWinnings',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"collectFees"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolCollectFees = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'collectFees',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"collectRemainingBalance"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolCollectRemainingBalance = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'collectRemainingBalance',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"createPool"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolCreatePool = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'createPool',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"deletePool"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolDeletePool = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'deletePool',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"deposit"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolDeposit = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'deposit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"emergencyWithdraw"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolEmergencyWithdraw = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'emergencyWithdraw',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"enableDeposit"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolEnableDeposit = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'enableDeposit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"endPool"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolEndPool = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'endPool',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"forfeitWinnings"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolForfeitWinnings = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'forfeitWinnings',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"grantRole"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolGrantRole = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'grantRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"pause"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolPause = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'pause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"reenableDeposit"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolReenableDeposit = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'reenableDeposit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"refundParticipant"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolRefundParticipant = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'refundParticipant',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolRenounceOwnership = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"renounceRole"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolRenounceRole = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'renounceRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"revokeRole"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolRevokeRole = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'revokeRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"selfRefund"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolSelfRefund = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'selfRefund',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"setWinner"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolSetWinner = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'setWinner',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"setWinners"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolSetWinners = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'setWinners',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"sponsor"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolSponsor = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'sponsor',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"startPool"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolStartPool = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'startPool',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolTransferOwnership = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'transferOwnership',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"unpause"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWritePoolUnpause = /*#__PURE__*/ createUseWriteContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'unpause',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePool = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"acceptOwnership"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolAcceptOwnership = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'acceptOwnership',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"changeEndTime"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolChangeEndTime = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'changeEndTime',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"changePoolName"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolChangePoolName = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'changePoolName',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"changeStartTime"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolChangeStartTime = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'changeStartTime',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"claimWinning"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolClaimWinning = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'claimWinning',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"claimWinnings"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolClaimWinnings = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'claimWinnings',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"collectFees"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolCollectFees = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'collectFees',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"collectRemainingBalance"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolCollectRemainingBalance = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'collectRemainingBalance',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"createPool"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolCreatePool = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'createPool',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"deletePool"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolDeletePool = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'deletePool',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"deposit"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolDeposit = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'deposit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"emergencyWithdraw"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolEmergencyWithdraw = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'emergencyWithdraw',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"enableDeposit"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolEnableDeposit = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'enableDeposit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"endPool"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolEndPool = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'endPool',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"forfeitWinnings"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolForfeitWinnings = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'forfeitWinnings',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"grantRole"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolGrantRole = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'grantRole',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"pause"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolPause = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'pause',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"reenableDeposit"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolReenableDeposit = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'reenableDeposit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"refundParticipant"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolRefundParticipant = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'refundParticipant',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolRenounceOwnership = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"renounceRole"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolRenounceRole = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'renounceRole',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"revokeRole"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolRevokeRole = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'revokeRole',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"selfRefund"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolSelfRefund = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'selfRefund',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"setWinner"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolSetWinner = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'setWinner',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"setWinners"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolSetWinners = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'setWinners',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"sponsor"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolSponsor = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'sponsor',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"startPool"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolStartPool = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'startPool',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolTransferOwnership = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'transferOwnership',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link poolAbi}__ and `functionName` set to `"unpause"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useSimulatePoolUnpause = /*#__PURE__*/ createUseSimulateContract({
    abi: poolAbi,
    address: poolAddress,
    functionName: 'unpause',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"Deposit"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolDepositEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'Deposit',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"ExtraDeposit"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolExtraDepositEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'ExtraDeposit',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"FeesCharged"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolFeesChargedEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'FeesCharged',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"FeesCollected"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolFeesCollectedEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'FeesCollected',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"JoinedPoolsRemoved"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolJoinedPoolsRemovedEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'JoinedPoolsRemoved',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"OwnershipTransferStarted"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolOwnershipTransferStartedEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'OwnershipTransferStarted',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolOwnershipTransferredEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'OwnershipTransferred',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"ParticipantRejoined"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolParticipantRejoinedEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'ParticipantRejoined',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"ParticipantRemoved"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolParticipantRemovedEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'ParticipantRemoved',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"Paused"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolPausedEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'Paused',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"PoolBalanceUpdated"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolPoolBalanceUpdatedEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'PoolBalanceUpdated',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"PoolCreated"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolPoolCreatedEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'PoolCreated',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"PoolEndTimeChanged"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolPoolEndTimeChangedEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'PoolEndTimeChanged',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"PoolNameChanged"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolPoolNameChangedEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'PoolNameChanged',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"PoolStartTimeChanged"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolPoolStartTimeChangedEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'PoolStartTimeChanged',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"PoolStatusChanged"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolPoolStatusChangedEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'PoolStatusChanged',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"Refund"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolRefundEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'Refund',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"RemainingBalanceCollected"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolRemainingBalanceCollectedEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'RemainingBalanceCollected',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"RoleAdminChanged"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolRoleAdminChangedEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'RoleAdminChanged',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"RoleGranted"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolRoleGrantedEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'RoleGranted',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"RoleRevoked"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolRoleRevokedEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'RoleRevoked',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"SponsorshipAdded"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolSponsorshipAddedEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'SponsorshipAdded',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"Unpaused"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolUnpausedEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'Unpaused',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"WinnerSet"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolWinnerSetEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'WinnerSet',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"WinningForfeited"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolWinningForfeitedEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'WinningForfeited',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link poolAbi}__ and `eventName` set to `"WinningsClaimed"`
 *
 * [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x5C22662210E48D0f5614cACA6f7a6a938716Ea26)
 */
export const useWatchPoolWinningsClaimedEvent = /*#__PURE__*/ createUseWatchContractEvent({
    abi: poolAbi,
    address: poolAddress,
    eventName: 'WinningsClaimed',
})
