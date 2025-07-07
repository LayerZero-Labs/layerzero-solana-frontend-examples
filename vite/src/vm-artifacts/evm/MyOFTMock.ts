//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MyOFT
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const myOftAbi = [
    {
        type: 'constructor',
        inputs: [
            { name: '_name', internalType: 'string', type: 'string' },
            { name: '_symbol', internalType: 'string', type: 'string' },
            { name: '_lzEndpoint', internalType: 'address', type: 'address' },
            { name: '_delegate', internalType: 'address', type: 'address' },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'SEND',
        outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'SEND_AND_CALL',
        outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            {
                name: 'origin',
                internalType: 'struct Origin',
                type: 'tuple',
                components: [
                    { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
                    { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
                    { name: 'nonce', internalType: 'uint64', type: 'uint64' },
                ],
            },
        ],
        name: 'allowInitializePath',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'owner', internalType: 'address', type: 'address' },
            { name: 'spender', internalType: 'address', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'approvalRequired',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'pure',
    },
    {
        type: 'function',
        inputs: [
            { name: 'spender', internalType: 'address', type: 'address' },
            { name: 'value', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: '_eid', internalType: 'uint32', type: 'uint32' },
            { name: '_msgType', internalType: 'uint16', type: 'uint16' },
            { name: '_extraOptions', internalType: 'bytes', type: 'bytes' },
        ],
        name: 'combineOptions',
        outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'decimalConversionRate',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'endpoint',
        outputs: [
            {
                name: '',
                internalType: 'contract ILayerZeroEndpointV2',
                type: 'address',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'eid', internalType: 'uint32', type: 'uint32' },
            { name: 'msgType', internalType: 'uint16', type: 'uint16' },
        ],
        name: 'enforcedOptions',
        outputs: [{ name: 'enforcedOption', internalType: 'bytes', type: 'bytes' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '',
                internalType: 'struct Origin',
                type: 'tuple',
                components: [
                    { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
                    { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
                    { name: 'nonce', internalType: 'uint64', type: 'uint64' },
                ],
            },
            { name: '', internalType: 'bytes', type: 'bytes' },
            { name: '_sender', internalType: 'address', type: 'address' },
        ],
        name: 'isComposeMsgSender',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: '_eid', internalType: 'uint32', type: 'uint32' },
            { name: '_peer', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'isPeer',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_origin',
                internalType: 'struct Origin',
                type: 'tuple',
                components: [
                    { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
                    { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
                    { name: 'nonce', internalType: 'uint64', type: 'uint64' },
                ],
            },
            { name: '_guid', internalType: 'bytes32', type: 'bytes32' },
            { name: '_message', internalType: 'bytes', type: 'bytes' },
            { name: '_executor', internalType: 'address', type: 'address' },
            { name: '_extraData', internalType: 'bytes', type: 'bytes' },
        ],
        name: 'lzReceive',
        outputs: [],
        stateMutability: 'payable',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_packets',
                internalType: 'struct InboundPacket[]',
                type: 'tuple[]',
                components: [
                    {
                        name: 'origin',
                        internalType: 'struct Origin',
                        type: 'tuple',
                        components: [
                            { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
                            { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
                            { name: 'nonce', internalType: 'uint64', type: 'uint64' },
                        ],
                    },
                    { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
                    { name: 'receiver', internalType: 'address', type: 'address' },
                    { name: 'guid', internalType: 'bytes32', type: 'bytes32' },
                    { name: 'value', internalType: 'uint256', type: 'uint256' },
                    { name: 'executor', internalType: 'address', type: 'address' },
                    { name: 'message', internalType: 'bytes', type: 'bytes' },
                    { name: 'extraData', internalType: 'bytes', type: 'bytes' },
                ],
            },
        ],
        name: 'lzReceiveAndRevert',
        outputs: [],
        stateMutability: 'payable',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_origin',
                internalType: 'struct Origin',
                type: 'tuple',
                components: [
                    { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
                    { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
                    { name: 'nonce', internalType: 'uint64', type: 'uint64' },
                ],
            },
            { name: '_guid', internalType: 'bytes32', type: 'bytes32' },
            { name: '_message', internalType: 'bytes', type: 'bytes' },
            { name: '_executor', internalType: 'address', type: 'address' },
            { name: '_extraData', internalType: 'bytes', type: 'bytes' },
        ],
        name: 'lzReceiveSimulate',
        outputs: [],
        stateMutability: 'payable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'msgInspector',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'name',
        outputs: [{ name: '', internalType: 'string', type: 'string' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: '', internalType: 'uint32', type: 'uint32' },
            { name: '', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'nextNonce',
        outputs: [{ name: 'nonce', internalType: 'uint64', type: 'uint64' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'oApp',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'oAppVersion',
        outputs: [
            { name: 'senderVersion', internalType: 'uint64', type: 'uint64' },
            { name: 'receiverVersion', internalType: 'uint64', type: 'uint64' },
        ],
        stateMutability: 'pure',
    },
    {
        type: 'function',
        inputs: [],
        name: 'oftVersion',
        outputs: [
            { name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' },
            { name: 'version', internalType: 'uint64', type: 'uint64' },
        ],
        stateMutability: 'pure',
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
        inputs: [{ name: 'eid', internalType: 'uint32', type: 'uint32' }],
        name: 'peers',
        outputs: [{ name: 'peer', internalType: 'bytes32', type: 'bytes32' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'preCrime',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_sendParam',
                internalType: 'struct SendParam',
                type: 'tuple',
                components: [
                    { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
                    { name: 'to', internalType: 'bytes32', type: 'bytes32' },
                    { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
                    { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
                    { name: 'extraOptions', internalType: 'bytes', type: 'bytes' },
                    { name: 'composeMsg', internalType: 'bytes', type: 'bytes' },
                    { name: 'oftCmd', internalType: 'bytes', type: 'bytes' },
                ],
            },
        ],
        name: 'quoteOFT',
        outputs: [
            {
                name: 'oftLimit',
                internalType: 'struct OFTLimit',
                type: 'tuple',
                components: [
                    { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
                    { name: 'maxAmountLD', internalType: 'uint256', type: 'uint256' },
                ],
            },
            {
                name: 'oftFeeDetails',
                internalType: 'struct OFTFeeDetail[]',
                type: 'tuple[]',
                components: [
                    { name: 'feeAmountLD', internalType: 'int256', type: 'int256' },
                    { name: 'description', internalType: 'string', type: 'string' },
                ],
            },
            {
                name: 'oftReceipt',
                internalType: 'struct OFTReceipt',
                type: 'tuple',
                components: [
                    { name: 'amountSentLD', internalType: 'uint256', type: 'uint256' },
                    {
                        name: 'amountReceivedLD',
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
        inputs: [
            {
                name: '_sendParam',
                internalType: 'struct SendParam',
                type: 'tuple',
                components: [
                    { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
                    { name: 'to', internalType: 'bytes32', type: 'bytes32' },
                    { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
                    { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
                    { name: 'extraOptions', internalType: 'bytes', type: 'bytes' },
                    { name: 'composeMsg', internalType: 'bytes', type: 'bytes' },
                    { name: 'oftCmd', internalType: 'bytes', type: 'bytes' },
                ],
            },
            { name: '_payInLzToken', internalType: 'bool', type: 'bool' },
        ],
        name: 'quoteSend',
        outputs: [
            {
                name: 'msgFee',
                internalType: 'struct MessagingFee',
                type: 'tuple',
                components: [
                    { name: 'nativeFee', internalType: 'uint256', type: 'uint256' },
                    { name: 'lzTokenFee', internalType: 'uint256', type: 'uint256' },
                ],
            },
        ],
        stateMutability: 'view',
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
            {
                name: '_sendParam',
                internalType: 'struct SendParam',
                type: 'tuple',
                components: [
                    { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
                    { name: 'to', internalType: 'bytes32', type: 'bytes32' },
                    { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
                    { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
                    { name: 'extraOptions', internalType: 'bytes', type: 'bytes' },
                    { name: 'composeMsg', internalType: 'bytes', type: 'bytes' },
                    { name: 'oftCmd', internalType: 'bytes', type: 'bytes' },
                ],
            },
            {
                name: '_fee',
                internalType: 'struct MessagingFee',
                type: 'tuple',
                components: [
                    { name: 'nativeFee', internalType: 'uint256', type: 'uint256' },
                    { name: 'lzTokenFee', internalType: 'uint256', type: 'uint256' },
                ],
            },
            { name: '_refundAddress', internalType: 'address', type: 'address' },
        ],
        name: 'send',
        outputs: [
            {
                name: 'msgReceipt',
                internalType: 'struct MessagingReceipt',
                type: 'tuple',
                components: [
                    { name: 'guid', internalType: 'bytes32', type: 'bytes32' },
                    { name: 'nonce', internalType: 'uint64', type: 'uint64' },
                    {
                        name: 'fee',
                        internalType: 'struct MessagingFee',
                        type: 'tuple',
                        components: [
                            { name: 'nativeFee', internalType: 'uint256', type: 'uint256' },
                            { name: 'lzTokenFee', internalType: 'uint256', type: 'uint256' },
                        ],
                    },
                ],
            },
            {
                name: 'oftReceipt',
                internalType: 'struct OFTReceipt',
                type: 'tuple',
                components: [
                    { name: 'amountSentLD', internalType: 'uint256', type: 'uint256' },
                    {
                        name: 'amountReceivedLD',
                        internalType: 'uint256',
                        type: 'uint256',
                    },
                ],
            },
        ],
        stateMutability: 'payable',
    },
    {
        type: 'function',
        inputs: [{ name: '_delegate', internalType: 'address', type: 'address' }],
        name: 'setDelegate',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_enforcedOptions',
                internalType: 'struct EnforcedOptionParam[]',
                type: 'tuple[]',
                components: [
                    { name: 'eid', internalType: 'uint32', type: 'uint32' },
                    { name: 'msgType', internalType: 'uint16', type: 'uint16' },
                    { name: 'options', internalType: 'bytes', type: 'bytes' },
                ],
            },
        ],
        name: 'setEnforcedOptions',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [{ name: '_msgInspector', internalType: 'address', type: 'address' }],
        name: 'setMsgInspector',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: '_eid', internalType: 'uint32', type: 'uint32' },
            { name: '_peer', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'setPeer',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [{ name: '_preCrime', internalType: 'address', type: 'address' }],
        name: 'setPreCrime',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'sharedDecimals',
        outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'symbol',
        outputs: [{ name: '', internalType: 'string', type: 'string' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'token',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'totalSupply',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'to', internalType: 'address', type: 'address' },
            { name: 'value', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'from', internalType: 'address', type: 'address' },
            { name: 'to', internalType: 'address', type: 'address' },
            { name: 'value', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'owner',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'spender',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'value',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'Approval',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: '_enforcedOptions',
                internalType: 'struct EnforcedOptionParam[]',
                type: 'tuple[]',
                components: [
                    { name: 'eid', internalType: 'uint32', type: 'uint32' },
                    { name: 'msgType', internalType: 'uint16', type: 'uint16' },
                    { name: 'options', internalType: 'bytes', type: 'bytes' },
                ],
                indexed: false,
            },
        ],
        name: 'EnforcedOptionSet',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'inspector',
                internalType: 'address',
                type: 'address',
                indexed: false,
            },
        ],
        name: 'MsgInspectorSet',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            { name: 'guid', internalType: 'bytes32', type: 'bytes32', indexed: true },
            {
                name: 'srcEid',
                internalType: 'uint32',
                type: 'uint32',
                indexed: false,
            },
            {
                name: 'toAddress',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'amountReceivedLD',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'OFTReceived',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            { name: 'guid', internalType: 'bytes32', type: 'bytes32', indexed: true },
            {
                name: 'dstEid',
                internalType: 'uint32',
                type: 'uint32',
                indexed: false,
            },
            {
                name: 'fromAddress',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'amountSentLD',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'amountReceivedLD',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'OFTSent',
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
            { name: 'eid', internalType: 'uint32', type: 'uint32', indexed: false },
            {
                name: 'peer',
                internalType: 'bytes32',
                type: 'bytes32',
                indexed: false,
            },
        ],
        name: 'PeerSet',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'preCrimeAddress',
                internalType: 'address',
                type: 'address',
                indexed: false,
            },
        ],
        name: 'PreCrimeSet',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            { name: 'from', internalType: 'address', type: 'address', indexed: true },
            { name: 'to', internalType: 'address', type: 'address', indexed: true },
            {
                name: 'value',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'Transfer',
    },
    {
        type: 'error',
        inputs: [
            { name: 'spender', internalType: 'address', type: 'address' },
            { name: 'allowance', internalType: 'uint256', type: 'uint256' },
            { name: 'needed', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'ERC20InsufficientAllowance',
    },
    {
        type: 'error',
        inputs: [
            { name: 'sender', internalType: 'address', type: 'address' },
            { name: 'balance', internalType: 'uint256', type: 'uint256' },
            { name: 'needed', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'ERC20InsufficientBalance',
    },
    {
        type: 'error',
        inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
        name: 'ERC20InvalidApprover',
    },
    {
        type: 'error',
        inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
        name: 'ERC20InvalidReceiver',
    },
    {
        type: 'error',
        inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
        name: 'ERC20InvalidSender',
    },
    {
        type: 'error',
        inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
        name: 'ERC20InvalidSpender',
    },
    { type: 'error', inputs: [], name: 'InvalidDelegate' },
    { type: 'error', inputs: [], name: 'InvalidEndpointCall' },
    { type: 'error', inputs: [], name: 'InvalidLocalDecimals' },
    {
        type: 'error',
        inputs: [{ name: 'options', internalType: 'bytes', type: 'bytes' }],
        name: 'InvalidOptions',
    },
    { type: 'error', inputs: [], name: 'LzTokenUnavailable' },
    {
        type: 'error',
        inputs: [{ name: 'eid', internalType: 'uint32', type: 'uint32' }],
        name: 'NoPeer',
    },
    {
        type: 'error',
        inputs: [{ name: 'msgValue', internalType: 'uint256', type: 'uint256' }],
        name: 'NotEnoughNative',
    },
    {
        type: 'error',
        inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
        name: 'OnlyEndpoint',
    },
    {
        type: 'error',
        inputs: [
            { name: 'eid', internalType: 'uint32', type: 'uint32' },
            { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'OnlyPeer',
    },
    { type: 'error', inputs: [], name: 'OnlySelf' },
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
        inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
        name: 'SafeERC20FailedOperation',
    },
    {
        type: 'error',
        inputs: [{ name: 'result', internalType: 'bytes', type: 'bytes' }],
        name: 'SimulationResult',
    },
    {
        type: 'error',
        inputs: [
            { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
            { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'SlippageExceeded',
    },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MyOFTMock
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Op Sepolia Blockscout__](https://optimism-sepolia.blockscout.com/address/0x2e42D5b38559b209b30815B692AC98641e7560b2)
 */
export const myOftMockAbi = [
    {
        type: 'constructor',
        inputs: [
            { name: '_name', internalType: 'string', type: 'string' },
            { name: '_symbol', internalType: 'string', type: 'string' },
            { name: '_lzEndpoint', internalType: 'address', type: 'address' },
            { name: '_delegate', internalType: 'address', type: 'address' },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'SEND',
        outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'SEND_AND_CALL',
        outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            {
                name: 'origin',
                internalType: 'struct Origin',
                type: 'tuple',
                components: [
                    { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
                    { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
                    { name: 'nonce', internalType: 'uint64', type: 'uint64' },
                ],
            },
        ],
        name: 'allowInitializePath',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'owner', internalType: 'address', type: 'address' },
            { name: 'spender', internalType: 'address', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'approvalRequired',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'pure',
    },
    {
        type: 'function',
        inputs: [
            { name: 'spender', internalType: 'address', type: 'address' },
            { name: 'value', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: '_eid', internalType: 'uint32', type: 'uint32' },
            { name: '_msgType', internalType: 'uint16', type: 'uint16' },
            { name: '_extraOptions', internalType: 'bytes', type: 'bytes' },
        ],
        name: 'combineOptions',
        outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'decimalConversionRate',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'endpoint',
        outputs: [
            {
                name: '',
                internalType: 'contract ILayerZeroEndpointV2',
                type: 'address',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'eid', internalType: 'uint32', type: 'uint32' },
            { name: 'msgType', internalType: 'uint16', type: 'uint16' },
        ],
        name: 'enforcedOptions',
        outputs: [{ name: 'enforcedOption', internalType: 'bytes', type: 'bytes' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '',
                internalType: 'struct Origin',
                type: 'tuple',
                components: [
                    { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
                    { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
                    { name: 'nonce', internalType: 'uint64', type: 'uint64' },
                ],
            },
            { name: '', internalType: 'bytes', type: 'bytes' },
            { name: '_sender', internalType: 'address', type: 'address' },
        ],
        name: 'isComposeMsgSender',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: '_eid', internalType: 'uint32', type: 'uint32' },
            { name: '_peer', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'isPeer',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_origin',
                internalType: 'struct Origin',
                type: 'tuple',
                components: [
                    { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
                    { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
                    { name: 'nonce', internalType: 'uint64', type: 'uint64' },
                ],
            },
            { name: '_guid', internalType: 'bytes32', type: 'bytes32' },
            { name: '_message', internalType: 'bytes', type: 'bytes' },
            { name: '_executor', internalType: 'address', type: 'address' },
            { name: '_extraData', internalType: 'bytes', type: 'bytes' },
        ],
        name: 'lzReceive',
        outputs: [],
        stateMutability: 'payable',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_packets',
                internalType: 'struct InboundPacket[]',
                type: 'tuple[]',
                components: [
                    {
                        name: 'origin',
                        internalType: 'struct Origin',
                        type: 'tuple',
                        components: [
                            { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
                            { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
                            { name: 'nonce', internalType: 'uint64', type: 'uint64' },
                        ],
                    },
                    { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
                    { name: 'receiver', internalType: 'address', type: 'address' },
                    { name: 'guid', internalType: 'bytes32', type: 'bytes32' },
                    { name: 'value', internalType: 'uint256', type: 'uint256' },
                    { name: 'executor', internalType: 'address', type: 'address' },
                    { name: 'message', internalType: 'bytes', type: 'bytes' },
                    { name: 'extraData', internalType: 'bytes', type: 'bytes' },
                ],
            },
        ],
        name: 'lzReceiveAndRevert',
        outputs: [],
        stateMutability: 'payable',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_origin',
                internalType: 'struct Origin',
                type: 'tuple',
                components: [
                    { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
                    { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
                    { name: 'nonce', internalType: 'uint64', type: 'uint64' },
                ],
            },
            { name: '_guid', internalType: 'bytes32', type: 'bytes32' },
            { name: '_message', internalType: 'bytes', type: 'bytes' },
            { name: '_executor', internalType: 'address', type: 'address' },
            { name: '_extraData', internalType: 'bytes', type: 'bytes' },
        ],
        name: 'lzReceiveSimulate',
        outputs: [],
        stateMutability: 'payable',
    },
    {
        type: 'function',
        inputs: [
            { name: '_to', internalType: 'address', type: 'address' },
            { name: '_amount', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'mint',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'msgInspector',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'name',
        outputs: [{ name: '', internalType: 'string', type: 'string' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: '', internalType: 'uint32', type: 'uint32' },
            { name: '', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'nextNonce',
        outputs: [{ name: 'nonce', internalType: 'uint64', type: 'uint64' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'oApp',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'oAppVersion',
        outputs: [
            { name: 'senderVersion', internalType: 'uint64', type: 'uint64' },
            { name: 'receiverVersion', internalType: 'uint64', type: 'uint64' },
        ],
        stateMutability: 'pure',
    },
    {
        type: 'function',
        inputs: [],
        name: 'oftVersion',
        outputs: [
            { name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' },
            { name: 'version', internalType: 'uint64', type: 'uint64' },
        ],
        stateMutability: 'pure',
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
        inputs: [{ name: 'eid', internalType: 'uint32', type: 'uint32' }],
        name: 'peers',
        outputs: [{ name: 'peer', internalType: 'bytes32', type: 'bytes32' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'preCrime',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_sendParam',
                internalType: 'struct SendParam',
                type: 'tuple',
                components: [
                    { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
                    { name: 'to', internalType: 'bytes32', type: 'bytes32' },
                    { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
                    { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
                    { name: 'extraOptions', internalType: 'bytes', type: 'bytes' },
                    { name: 'composeMsg', internalType: 'bytes', type: 'bytes' },
                    { name: 'oftCmd', internalType: 'bytes', type: 'bytes' },
                ],
            },
        ],
        name: 'quoteOFT',
        outputs: [
            {
                name: 'oftLimit',
                internalType: 'struct OFTLimit',
                type: 'tuple',
                components: [
                    { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
                    { name: 'maxAmountLD', internalType: 'uint256', type: 'uint256' },
                ],
            },
            {
                name: 'oftFeeDetails',
                internalType: 'struct OFTFeeDetail[]',
                type: 'tuple[]',
                components: [
                    { name: 'feeAmountLD', internalType: 'int256', type: 'int256' },
                    { name: 'description', internalType: 'string', type: 'string' },
                ],
            },
            {
                name: 'oftReceipt',
                internalType: 'struct OFTReceipt',
                type: 'tuple',
                components: [
                    { name: 'amountSentLD', internalType: 'uint256', type: 'uint256' },
                    {
                        name: 'amountReceivedLD',
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
        inputs: [
            {
                name: '_sendParam',
                internalType: 'struct SendParam',
                type: 'tuple',
                components: [
                    { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
                    { name: 'to', internalType: 'bytes32', type: 'bytes32' },
                    { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
                    { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
                    { name: 'extraOptions', internalType: 'bytes', type: 'bytes' },
                    { name: 'composeMsg', internalType: 'bytes', type: 'bytes' },
                    { name: 'oftCmd', internalType: 'bytes', type: 'bytes' },
                ],
            },
            { name: '_payInLzToken', internalType: 'bool', type: 'bool' },
        ],
        name: 'quoteSend',
        outputs: [
            {
                name: 'msgFee',
                internalType: 'struct MessagingFee',
                type: 'tuple',
                components: [
                    { name: 'nativeFee', internalType: 'uint256', type: 'uint256' },
                    { name: 'lzTokenFee', internalType: 'uint256', type: 'uint256' },
                ],
            },
        ],
        stateMutability: 'view',
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
            {
                name: '_sendParam',
                internalType: 'struct SendParam',
                type: 'tuple',
                components: [
                    { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
                    { name: 'to', internalType: 'bytes32', type: 'bytes32' },
                    { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
                    { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
                    { name: 'extraOptions', internalType: 'bytes', type: 'bytes' },
                    { name: 'composeMsg', internalType: 'bytes', type: 'bytes' },
                    { name: 'oftCmd', internalType: 'bytes', type: 'bytes' },
                ],
            },
            {
                name: '_fee',
                internalType: 'struct MessagingFee',
                type: 'tuple',
                components: [
                    { name: 'nativeFee', internalType: 'uint256', type: 'uint256' },
                    { name: 'lzTokenFee', internalType: 'uint256', type: 'uint256' },
                ],
            },
            { name: '_refundAddress', internalType: 'address', type: 'address' },
        ],
        name: 'send',
        outputs: [
            {
                name: 'msgReceipt',
                internalType: 'struct MessagingReceipt',
                type: 'tuple',
                components: [
                    { name: 'guid', internalType: 'bytes32', type: 'bytes32' },
                    { name: 'nonce', internalType: 'uint64', type: 'uint64' },
                    {
                        name: 'fee',
                        internalType: 'struct MessagingFee',
                        type: 'tuple',
                        components: [
                            { name: 'nativeFee', internalType: 'uint256', type: 'uint256' },
                            { name: 'lzTokenFee', internalType: 'uint256', type: 'uint256' },
                        ],
                    },
                ],
            },
            {
                name: 'oftReceipt',
                internalType: 'struct OFTReceipt',
                type: 'tuple',
                components: [
                    { name: 'amountSentLD', internalType: 'uint256', type: 'uint256' },
                    {
                        name: 'amountReceivedLD',
                        internalType: 'uint256',
                        type: 'uint256',
                    },
                ],
            },
        ],
        stateMutability: 'payable',
    },
    {
        type: 'function',
        inputs: [{ name: '_delegate', internalType: 'address', type: 'address' }],
        name: 'setDelegate',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            {
                name: '_enforcedOptions',
                internalType: 'struct EnforcedOptionParam[]',
                type: 'tuple[]',
                components: [
                    { name: 'eid', internalType: 'uint32', type: 'uint32' },
                    { name: 'msgType', internalType: 'uint16', type: 'uint16' },
                    { name: 'options', internalType: 'bytes', type: 'bytes' },
                ],
            },
        ],
        name: 'setEnforcedOptions',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [{ name: '_msgInspector', internalType: 'address', type: 'address' }],
        name: 'setMsgInspector',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: '_eid', internalType: 'uint32', type: 'uint32' },
            { name: '_peer', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'setPeer',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [{ name: '_preCrime', internalType: 'address', type: 'address' }],
        name: 'setPreCrime',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [],
        name: 'sharedDecimals',
        outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'symbol',
        outputs: [{ name: '', internalType: 'string', type: 'string' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'token',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [],
        name: 'totalSupply',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        inputs: [
            { name: 'to', internalType: 'address', type: 'address' },
            { name: 'value', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [
            { name: 'from', internalType: 'address', type: 'address' },
            { name: 'to', internalType: 'address', type: 'address' },
            { name: 'value', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'owner',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'spender',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'value',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'Approval',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: '_enforcedOptions',
                internalType: 'struct EnforcedOptionParam[]',
                type: 'tuple[]',
                components: [
                    { name: 'eid', internalType: 'uint32', type: 'uint32' },
                    { name: 'msgType', internalType: 'uint16', type: 'uint16' },
                    { name: 'options', internalType: 'bytes', type: 'bytes' },
                ],
                indexed: false,
            },
        ],
        name: 'EnforcedOptionSet',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'inspector',
                internalType: 'address',
                type: 'address',
                indexed: false,
            },
        ],
        name: 'MsgInspectorSet',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            { name: 'guid', internalType: 'bytes32', type: 'bytes32', indexed: true },
            {
                name: 'srcEid',
                internalType: 'uint32',
                type: 'uint32',
                indexed: false,
            },
            {
                name: 'toAddress',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'amountReceivedLD',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'OFTReceived',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            { name: 'guid', internalType: 'bytes32', type: 'bytes32', indexed: true },
            {
                name: 'dstEid',
                internalType: 'uint32',
                type: 'uint32',
                indexed: false,
            },
            {
                name: 'fromAddress',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'amountSentLD',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
            {
                name: 'amountReceivedLD',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'OFTSent',
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
            { name: 'eid', internalType: 'uint32', type: 'uint32', indexed: false },
            {
                name: 'peer',
                internalType: 'bytes32',
                type: 'bytes32',
                indexed: false,
            },
        ],
        name: 'PeerSet',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'preCrimeAddress',
                internalType: 'address',
                type: 'address',
                indexed: false,
            },
        ],
        name: 'PreCrimeSet',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            { name: 'from', internalType: 'address', type: 'address', indexed: true },
            { name: 'to', internalType: 'address', type: 'address', indexed: true },
            {
                name: 'value',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'Transfer',
    },
    {
        type: 'error',
        inputs: [
            { name: 'spender', internalType: 'address', type: 'address' },
            { name: 'allowance', internalType: 'uint256', type: 'uint256' },
            { name: 'needed', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'ERC20InsufficientAllowance',
    },
    {
        type: 'error',
        inputs: [
            { name: 'sender', internalType: 'address', type: 'address' },
            { name: 'balance', internalType: 'uint256', type: 'uint256' },
            { name: 'needed', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'ERC20InsufficientBalance',
    },
    {
        type: 'error',
        inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
        name: 'ERC20InvalidApprover',
    },
    {
        type: 'error',
        inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
        name: 'ERC20InvalidReceiver',
    },
    {
        type: 'error',
        inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
        name: 'ERC20InvalidSender',
    },
    {
        type: 'error',
        inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
        name: 'ERC20InvalidSpender',
    },
    { type: 'error', inputs: [], name: 'InvalidDelegate' },
    { type: 'error', inputs: [], name: 'InvalidEndpointCall' },
    { type: 'error', inputs: [], name: 'InvalidLocalDecimals' },
    {
        type: 'error',
        inputs: [{ name: 'options', internalType: 'bytes', type: 'bytes' }],
        name: 'InvalidOptions',
    },
    { type: 'error', inputs: [], name: 'LzTokenUnavailable' },
    {
        type: 'error',
        inputs: [{ name: 'eid', internalType: 'uint32', type: 'uint32' }],
        name: 'NoPeer',
    },
    {
        type: 'error',
        inputs: [{ name: 'msgValue', internalType: 'uint256', type: 'uint256' }],
        name: 'NotEnoughNative',
    },
    {
        type: 'error',
        inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
        name: 'OnlyEndpoint',
    },
    {
        type: 'error',
        inputs: [
            { name: 'eid', internalType: 'uint32', type: 'uint32' },
            { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
        ],
        name: 'OnlyPeer',
    },
    { type: 'error', inputs: [], name: 'OnlySelf' },
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
        inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
        name: 'SafeERC20FailedOperation',
    },
    {
        type: 'error',
        inputs: [{ name: 'result', internalType: 'bytes', type: 'bytes' }],
        name: 'SimulationResult',
    },
    {
        type: 'error',
        inputs: [
            { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
            { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'SlippageExceeded',
    },
] as const

/**
 * [__View Contract on Op Sepolia Blockscout__](https://optimism-sepolia.blockscout.com/address/0x2e42D5b38559b209b30815B692AC98641e7560b2)
 */
export const myOftMockAddress = {
    11155420: '0x2e42D5b38559b209b30815B692AC98641e7560b2',
} as const

/**
 * [__View Contract on Op Sepolia Blockscout__](https://optimism-sepolia.blockscout.com/address/0x2e42D5b38559b209b30815B692AC98641e7560b2)
 */
export const myOftMockConfig = {
    address: myOftMockAddress,
    abi: myOftMockAbi,
} as const
