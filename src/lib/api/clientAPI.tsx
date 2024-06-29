import { contractAddress, dropletIFace, poolIFace, provider, tokenAddress } from '@/lib/constants/constants'
import { dropletAbi, poolAbi } from '@/types/contracts'
import { ConnectedWallet } from '@privy-io/react-auth'
import { PostgrestSingleResponse } from '@supabase/supabase-js'
import { ethers } from 'ethers'
import lodash from 'lodash'
import { getSupabaseBrowserClient } from '../database/client'

export interface writeTestObject {
    address: string
    jwt: any
}

export interface addressObject {
    address: string
}

export interface backendLoginObject {
    address: string
    message: string
    signedMessage: string
    nonce: string
}

export interface FileObj {
    name: string
    type: string
    data: Blob
}

const supabaseBrowserClient = getSupabaseBrowserClient()

export const uploadProfileImage = async (fileBlob: any, selectedFile: any, selectedFileBase64: string, jwt: string) => {
    let dataObj = {
        fileName: selectedFile.name,
        fileType: selectedFile.type,

        selectedFileBase64: selectedFileBase64,
        jwtString: jwt,
    }

    console.log('selectedFile', selectedFile)
    console.log('fileBlob', selectedFile)

    try {
        const response = await fetch('/api/upload_profile_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataObj),
        })

        if (response.ok) {
            const data = await response.json()
            // setFileUrl(data.fileUrl)
        } else {
            console.error('Error uploading file')
        }
    } catch (error) {
        console.error('Error uploading file:', error)
    }
}

export const handleUpdateUserDisplayData = async ({ params }: { params: [string, string, string, string] }) => {
    const [displayName, company, bio, jwt] = params
    let dataObj = {
        display_name: displayName,
        company: company,
        bio: bio,
        jwtString: jwt,
    }
    try {
        const response = await fetch('/api/update_user_display_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataObj),
        })

        if (response.ok) {
            const data = await response.json()
        } else {
            console.error('Error updating profile')
            throw new Error('Error updating profile')
        }
    } catch (error) {
        console.error('Error uploading file:', error)
        throw new Error('Error updating profile')
    }
}

export const fetchUpcomingPools = async () => {
    // Upload image to Supabase storage
    const supabaseClient = getSupabaseBrowserClient()
    const currentTimestamp = new Date().toISOString()

    const { data, error } = await supabaseClient.from('pools').select('*').filter('startDate', 'gt', currentTimestamp)

    if (error) {
        console.error('Error fetching pool data:', error.message)
    } else {
        return data
    }
}

export const fetchPastPools = async () => {
    // Upload image to Supabase storage
    const supabaseClient = getSupabaseBrowserClient()
    const currentTimestamp = new Date().toISOString()

    const { data, error } = await supabaseClient.from('pools').select('*').filter('endDate', 'lt', currentTimestamp)

    if (error) {
        console.error('Error fetching pool data:', error.message)
    } else {
        return data
    }
}

export const fetchUserDisplayInfoFromServer = async (addressList: string[]) => {
    console.log('addressList', addressList)
    const lowerAddressList = addressList.map(address => address?.toLowerCase())
    const { data, error }: PostgrestSingleResponse<any[]> = await supabaseBrowserClient
        .from('users')
        .select()
        .in('walletAddress', lowerAddressList)

    if (error) {
        console.error('Error reading data:', error)
        return
    } else {
        console.log('fetchUserDisplayInfoFromServer data:', data)
        return data
    }
}

// This is a similar query as above, but using Tanstack
export const fetchParticipantsDataFromServer = async ({ queryKey }: { queryKey: [string, string, string[]] }) => {
    const [_, poolId, addressList] = queryKey
    const lowerAddressList = addressList.map(address => address.toLowerCase())
    const { data, error } = await supabaseBrowserClient.from('users').select().in('walletAddress', lowerAddressList)
    if (error) {
        console.error('Error reading data:', error)
        return
    }

    console.log('usersDisplayData', data)

    const { data: participationData, error: participationError }: PostgrestSingleResponse<any[]> =
        await supabaseBrowserClient
            .from('pool_participants')
            .select()
            .match({ pool_id: poolId })
            .in(
                'user_id',
                data.map(row => row.id),
            )
            .order('created_at', { ascending: false })
            .limit(1)

    if (participationError) {
        console.error('Error reading participation data:', error)
        return
    }
    console.log('participationData', participationData)

    const joinedData = data.map(row1 => {
        const matchingRows = participationData.filter(row2 => row2.participant_address === row1.walletAddress)
        return {
            ...row1,
            participationData: matchingRows,
        }
    })

    console.log('fetchUserDisplayInfoFromServer data:', joinedData)

    return joinedData
}

export const fetchUserDisplayForAddress = async ({ queryKey }: { queryKey: [string, string] }) => {
    const [_, address] = queryKey

    const lowerAddress = address.toLowerCase()

    console.log('lowerAddress', lowerAddress)

    const { data: userDisplayData, error } = await supabaseBrowserClient
        .from('users')
        .select('*')
        .eq('walletAddress', lowerAddress)
        .single()

    console.log('userDisplayData', userDisplayData)

    if (error) {
        console.error('address error:', lowerAddress)
        console.error('Error reading data:', error)
        return { userDisplayData: '', profileImageUrl: '' }
    }
    if (userDisplayData?.avatar) {
        const { data: storageData } = await supabaseBrowserClient.storage
            .from('profile')
            .getPublicUrl(userDisplayData?.avatar)
        console.log('userDisplayData', userDisplayData)

        return { userDisplayData, profileImageUrl: storageData.publicUrl }
    }
    console.log('userDisplayData', userDisplayData)
    return { userDisplayData }
}

export const fetchAllPoolDataFromSC = async ({ queryKey }: { queryKey: [string, string] }) => {
    const [_, poolId] = queryKey
    const contract = new ethers.Contract(contractAddress, poolAbi, provider)

    const poolSCInfo = await contract.getAllPoolInfo(poolId)

    console.log('retrievedAllPoolInfo', poolSCInfo)
    console.log('retrievedAllPoolInfo[0]', poolSCInfo[0])
    console.log('retrievedAllPoolInfo[1]', poolSCInfo[1])
    console.log('retrievedAllPoolInfo[2]', poolSCInfo[2])
    console.log('retrievedAllPoolInfo[3]', poolSCInfo[3])
    console.log('retrievedAllPoolInfo[4]', poolSCInfo[4])
    console.log('retrievedAllPoolInfo[5]', poolSCInfo[5])
    console.log('retrievedAllPoolInfo[6]', poolSCInfo[6])
    return poolSCInfo
}

export const fetchAllPoolDataFromDB = async ({ queryKey }: { queryKey: [string, string] }) => {
    console.log('fetchPoolDataFromDB')
    const [_, poolId] = queryKey
    const { data, error }: PostgrestSingleResponse<any[]> = await supabaseBrowserClient
        .from('pools')
        .select()
        .eq('contract_id', poolId)

    if (error) {
        console.error('Error fetchPoolDataFromDB:', error.message)
        return {}
    }

    console.log('Pool data', JSON.stringify(data))
    if (data.length == 0) {
        console.log('No Such Pool')
        console.error('Error fetchPoolDataFromDB:')

        return {}
    }

    console.log('fetchPoolDataFromDB: Fetching Pool Image Url')

    let poolImageUrl = null
    console.log('pool_image_url', data[0].pool_image_url)
    if (!lodash.isEmpty(data[0].pool_image_url)) {
        const { data: storageData } = supabaseBrowserClient.storage.from('pool').getPublicUrl(data[0].pool_image_url)
        poolImageUrl = storageData.publicUrl
        console.log('poolImageUrl', storageData.publicUrl)
    }

    console.log('fetchPoolDataFromDB: Fetching cohostUserDisplayData')

    let cohostUserDisplayData
    if (data[0]?.co_host_addresses?.length > 0) {
        const cohostDisplayData = await fetchUserDisplayInfoFromServer(data[0]?.co_host_addresses)
        cohostUserDisplayData = cohostDisplayData
    }
    console.log('fetchPoolDataFromDB return')

    return {
        poolDBInfo: data[0],
        poolImageUrl,
        cohostUserDisplayData,
    }
}

export const handleRegisterServer = async ({ params }: { params: [string, string, string] }) => {
    const [poolId, walletAddress, jwtString] = params

    const formData = {
        poolId,
        walletAddress,
        jwtString,
    }
    try {
        const response = await fetch('/api/join_pool', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })

        if (response.ok) {
            console.log('Join success')
            const msg = await response.json()
            console.log(msg)
            // Handle success
            // fetchPoolDataFromDB()
        } else {
            console.error('Error sending data')
            // Handle error
        }
    } catch (error) {
        console.error('Error:', error)
        throw new Error('Failed handleRegisterServer')

        // Handle error
    }
}

export const handleUnregisterServer = async ({ params }: { params: [string, string, string] }) => {
    const [poolId, walletAddress, jwtString] = params

    const formData = {
        poolId,
        walletAddress,
        jwtString,
    }
    try {
        const response = await fetch('/api/unjoin_pool', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })

        if (response.ok) {
            console.log('Unjoin success')
            const msg = await response.json()
            console.log(msg)
        } else {
            console.error('Error sending data')
            // Handle error
        }
    } catch (error) {
        console.error('Error:', error)
        throw new Error('Failed handleUnregisterServer')

        // Handle error
    }
}

export const handleRegister = async ({ params }: { params: [string, string, ConnectedWallet[]] }) => {
    const [poolId, deposit, wallets] = params

    const walletAddress = wallets[0].address
    const wallet = wallets[0]
    let approveDropletDataString = dropletIFace.encodeFunctionData('approve', [contractAddress, deposit])

    try {
        const provider = await wallet.getEthereumProvider()
        const signedTxn = await provider.request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: walletAddress,
                    to: tokenAddress,
                    data: approveDropletDataString,
                },
            ],
        })
        let transactionReceipt = null
        while (transactionReceipt === null) {
            transactionReceipt = await provider.request({
                method: 'eth_getTransactionReceipt',
                params: [signedTxn],
            })
            await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds before checking again
        }
        console.log('Transaction confirmed!', transactionReceipt)
    } catch (e: any) {
        console.log('User did not sign transaction')
        throw new Error('User did not sign transaction')
    }

    let depositDataString = poolIFace.encodeFunctionData('deposit', [poolId, deposit])

    try {
        const provider = await wallet.getEthereumProvider()
        const signedTxn = await provider.request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: walletAddress,
                    to: contractAddress,
                    data: depositDataString,
                },
            ],
        })
        let transactionReceipt = null
        while (transactionReceipt === null) {
            transactionReceipt = await provider.request({
                method: 'eth_getTransactionReceipt',
                params: [signedTxn],
            })
            await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds before checking again
        }
        console.log('Transaction confirmed!', transactionReceipt)
    } catch (e: any) {
        console.log('User did not sign transaction')
        return
    }
}

export const handleUnregister = async ({ params }: { params: [string, ConnectedWallet[]] }) => {
    const [poolId, wallets] = params

    const walletAddress = wallets[0].address
    const wallet = wallets[0]

    const address = wallet.address
    console.log('wallet', walletAddress)
    console.log('poolId', poolId)
    let selfRefundDataString = poolIFace.encodeFunctionData('selfRefund', [poolId])

    try {
        const provider = await wallet.getEthereumProvider()
        const signedTxn = await provider.request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: address,
                    to: contractAddress,
                    data: selfRefundDataString,
                },
            ],
        })
        let transactionReceipt = null
        while (transactionReceipt === null) {
            transactionReceipt = await provider.request({
                method: 'eth_getTransactionReceipt',
                params: [signedTxn],
            })
            await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds before checking again
        }
        console.log('Transaction confirmed!', transactionReceipt)
    } catch (e: any) {
        console.log('User did not sign transaction')
        throw new Error('User did not sign transaction')
    }
}

export const fetchTokenSymbol = async ({ queryKey }: { queryKey: [string, string] }) => {
    const [_, poolTokenAddress] = queryKey
    const contract = new ethers.Contract(poolTokenAddress, dropletAbi, provider)
    console.log('poolTokenAddress', poolTokenAddress)

    const tokenSymbol = await contract.symbol()

    console.log('tokenSymbol', tokenSymbol)
    return tokenSymbol
}

export const fetchTokenDecimals = async ({ queryKey }: { queryKey: [string, string] }) => {
    const [_, poolTokenAddress] = queryKey
    const contract = new ethers.Contract(poolTokenAddress, dropletAbi, provider)
    const tokenDecimals = await contract.decimals()
    console.log('tokenDecimals', tokenDecimals)
    return tokenDecimals
}

export const fetchLatestPoolId = async ({ queryKey }: { queryKey: [string] }) => {
    const [_] = queryKey
    const contract = new ethers.Contract(contractAddress, poolAbi, provider)
    const latestPoolId = await contract.latestPoolId()
    console.log('latestPoolId', latestPoolId)
    return latestPoolId
}

export const handleEnableDeposit = async ({ params }: { params: [string, ConnectedWallet[]] }) => {
    const [poolId, wallets] = params

    const walletAddress = wallets[0].address
    const wallet = wallets[0]
    let enableDepositDataString = poolIFace.encodeFunctionData('enableDeposit', [poolId])

    try {
        const provider = await wallet.getEthereumProvider()
        const signedTxn = await provider.request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: walletAddress,
                    to: contractAddress,
                    data: enableDepositDataString,
                },
            ],
        })
        let transactionReceipt = null
        while (transactionReceipt === null) {
            transactionReceipt = await provider.request({
                method: 'eth_getTransactionReceipt',
                params: [signedTxn],
            })
            await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds before checking again
        }
        console.log('Transaction confirmed!', transactionReceipt)
    } catch (e: any) {
        console.log('User did not sign transaction')
        throw new Error('User did not sign transaction')
    }
}

export const handleStartPool = async ({ params }: { params: [string, ConnectedWallet[]] }) => {
    const [poolId, wallets] = params

    const walletAddress = wallets[0].address
    const wallet = wallets[0]
    let startPoolDataString = poolIFace.encodeFunctionData('startPool', [poolId])

    try {
        const provider = await wallet.getEthereumProvider()
        const signedTxn = await provider.request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: walletAddress,
                    to: contractAddress,
                    data: startPoolDataString,
                },
            ],
        })
        let transactionReceipt = null
        while (transactionReceipt === null) {
            transactionReceipt = await provider.request({
                method: 'eth_getTransactionReceipt',
                params: [signedTxn],
            })
            await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds before checking again
        }
        console.log('Transaction confirmed!', transactionReceipt)
    } catch (e: any) {
        console.log('User did not sign transaction')
        throw new Error('User did not sign transaction')
    }
}

export const handleEndPool = async ({ params }: { params: [string, ConnectedWallet[]] }) => {
    const [poolId, wallets] = params

    const walletAddress = wallets[0].address
    const wallet = wallets[0]
    let endPoolDataString = poolIFace.encodeFunctionData('endPool', [poolId])

    try {
        const provider = await wallet.getEthereumProvider()
        const signedTxn = await provider.request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: walletAddress,
                    to: contractAddress,
                    data: endPoolDataString,
                },
            ],
        })
        let transactionReceipt = null
        while (transactionReceipt === null) {
            transactionReceipt = await provider.request({
                method: 'eth_getTransactionReceipt',
                params: [signedTxn],
            })
            await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds before checking again
        }
        console.log('Transaction confirmed!', transactionReceipt)
    } catch (e: any) {
        console.log('User did not sign transaction')
        throw new Error('User did not sign transaction')
    }
}

export const handleSetWinner = async ({ params }: { params: [string, string, string, ConnectedWallet[]] }) => {
    const [poolId, winnerAddress, amount, wallets] = params

    const walletAddress = wallets[0].address
    const wallet = wallets[0]
    let setWinnerDataString = poolIFace.encodeFunctionData('setWinner', [
        poolId,
        winnerAddress,
        ethers.parseEther(amount),
    ])

    try {
        const provider = await wallet.getEthereumProvider()
        const signedTxn = await provider.request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: walletAddress,
                    to: contractAddress,
                    data: setWinnerDataString,
                },
            ],
        })
        let transactionReceipt = null
        while (transactionReceipt === null) {
            transactionReceipt = await provider.request({
                method: 'eth_getTransactionReceipt',
                params: [signedTxn],
            })
            await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds before checking again
        }
        console.log('Transaction confirmed!', transactionReceipt)
    } catch (e: any) {
        console.log('User did not sign transaction')
        throw new Error('User did not sign transaction')
    }
}

export const handleSavePayout = async ({ params }: { params: [string, string, string, string] }) => {
    const [poolId, amount, winnerAddress, jwt] = params

    let dataObj = { poolId, winnerAddress, amount, jwtString: jwt }
    try {
        const response = await fetch('/api/save_payout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataObj),
        })
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error('There was a problem with the post operation:', error)
    }
}

export const handleRefundParticipant = async ({ params }: { params: [string, string, string, ConnectedWallet[]] }) => {
    const [poolId, winnerAddress, amount, wallets] = params

    const walletAddress = wallets[0].address
    const wallet = wallets[0]
    let setWinnerDataString = poolIFace.encodeFunctionData('refundParticipant', [
        poolId,
        winnerAddress,
        ethers.parseEther(amount),
    ])

    try {
        const provider = await wallet.getEthereumProvider()
        const signedTxn = await provider.request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: walletAddress,
                    to: contractAddress,
                    data: setWinnerDataString,
                },
            ],
        })
        let transactionReceipt = null
        while (transactionReceipt === null) {
            transactionReceipt = await provider.request({
                method: 'eth_getTransactionReceipt',
                params: [signedTxn],
            })
            await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds before checking again
        }
        console.log('Transaction confirmed!', transactionReceipt)
    } catch (e: any) {
        console.log('User did not sign transaction')
        throw new Error('User did not sign transaction')
    }
}

export const fetchWinnersDetailsFromSC = async ({ queryKey }: { queryKey: [string, string] }) => {
    const [_, poolId] = queryKey
    const contract = new ethers.Contract(contractAddress, poolAbi, provider)

    const winnersDetails = await contract.getWinnersDetails(poolId)
    console.log('winnersDetails', winnersDetails)
    return winnersDetails
}

export const fetchClaimablePoolsFromSC = async ({ queryKey }: { queryKey: [string, string] }) => {
    const [_, address] = queryKey
    const contract = new ethers.Contract(contractAddress, poolAbi, provider)

    const claimablePools = await contract.getClaimablePools(address)
    return claimablePools
}

export const fetchPoolBalanceFromSC = async ({ queryKey }: { queryKey: [string, string] }) => {
    const [_, poolId] = queryKey
    const contract = new ethers.Contract(contractAddress, poolAbi, provider)

    const poolBalance = await contract.poolBalance(poolId)
    console.log('winnersDetails', poolBalance)
    return poolBalance
}

// export const fetchSavedPayoutsFromServer = async ({
// 	queryKey,
// }: {
// 	queryKey: [string, string]
// }) => {
// 	const [_, poolId] = queryKey
// 	const { data: savedPayouts, error }: PostgrestSingleResponse<any[]> =
// 		await supabaseBrowserClient
// 			.from('savedPayouts')
// 			.select('*')
// 			.match({ pool_id: poolId })
// 	if (error) {
// 		console.error('Error reading data:', error)
// 		return
// 	}

// 	console.log('savedPayouts', savedPayouts)
// 	return savedPayouts
// }

export const handleSetWinners = async ({ params }: { params: [string, string[], string[], ConnectedWallet[]] }) => {
    const [poolId, winnerAddresses, amounts, wallets] = params

    const walletAddress = wallets[0].address
    const wallet = wallets[0]
    console.log('poolId', poolId)

    console.log('winnerAddresses', winnerAddresses)
    console.log('amounts', amounts)
    const amountsArray = amounts.map(
        amount => amount.toString(),

        // Math.floor(parseFloat(ethers.formatEther(amount))).toString(),
    )
    console.log('amountsArray', amountsArray)

    let setWinnersDataString = poolIFace.encodeFunctionData('setWinners', [poolId, winnerAddresses, amountsArray])
    try {
        const provider = await wallet.getEthereumProvider()
        const signedTxn = await provider.request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: walletAddress,
                    to: contractAddress,
                    data: setWinnersDataString,
                },
            ],
        })
        let transactionReceipt = null
        while (transactionReceipt === null) {
            transactionReceipt = await provider.request({
                method: 'eth_getTransactionReceipt',
                params: [signedTxn],
            })
            await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds before checking again
        }
        console.log('Transaction confirmed!', transactionReceipt)
    } catch (e: any) {
        console.log('User did not sign transaction')
        throw new Error('User did not sign transaction')
    }
}

export const handleDeleteSavedPayouts = async ({ params }: { params: [string, string[], string[], string] }) => {
    const [poolId, winnerAddresses, amounts, jwt] = params

    let dataObj = { poolId, winnerAddresses, amounts, jwtString: jwt }
    try {
        const response = await fetch('/api/delete_payout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataObj),
        })
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error('There was a problem with the post operation:', error)
    }
}

export const handleDeleteParticipant = async ({ params }: { params: [string, string, string] }) => {
    const [poolId, address, jwt] = params

    let dataObj = { poolId, address, jwtString: jwt }
    try {
        const response = await fetch('/api/delete_participant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataObj),
        })
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error('There was a problem with the post operation:', error)
    }
}

export const handleCheckIn = async ({ data, jwt }: { data: string; jwt: string }) => {
    // const [poolId, address, jwt] = params
    let qrDataObj: any = JSON.parse(data)
    let dataObj = {
        poolId: qrDataObj?.poolId,
        address: qrDataObj?.address,
        jwtString: jwt,
    }
    try {
        const response = await fetch('/api/check_in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataObj),
        })
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error('There was a problem with the post operation:', error)
    }
}

export const handleClaimWinning = async ({ params }: { params: [string, ConnectedWallet[]] }) => {
    const [poolId, wallets] = params

    const walletAddress = wallets[0].address
    const wallet = wallets[0]
    let claimWinningDataString = poolIFace.encodeFunctionData('claimWinning', [poolId, walletAddress])

    try {
        const provider = await wallet.getEthereumProvider()
        const signedTxn = await provider.request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: walletAddress,
                    to: contractAddress,
                    data: claimWinningDataString,
                },
            ],
        })
        let transactionReceipt = null
        while (transactionReceipt === null) {
            transactionReceipt = await provider.request({
                method: 'eth_getTransactionReceipt',
                params: [signedTxn],
            })
            await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds before checking again
        }
        console.log('Transaction confirmed!', transactionReceipt)
    } catch (e: any) {
        console.log('User did not sign transaction')
        throw new Error('User did not sign transaction')
    }
}

export const handleClaimWinnings = async ({ params }: { params: [string[], ConnectedWallet[]] }) => {
    const [poolIds, wallets] = params

    const walletAddress = wallets[0].address
    const wallet = wallets[0]
    const walletAddresses = poolIds.map(poolId => walletAddress)
    let claimWinningDataString = poolIFace.encodeFunctionData('claimWinnings', [poolIds, walletAddresses])

    try {
        const provider = await wallet.getEthereumProvider()
        const signedTxn = await provider.request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: walletAddress,
                    to: contractAddress,
                    data: claimWinningDataString,
                },
            ],
        })
        let transactionReceipt = null
        while (transactionReceipt === null) {
            transactionReceipt = await provider.request({
                method: 'eth_getTransactionReceipt',
                params: [signedTxn],
            })
            await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds before checking again
        }
        console.log('Transaction confirmed!', transactionReceipt)
    } catch (e: any) {
        console.log('User did not sign transaction')
        throw new Error('User did not sign transaction')
    }
}

export const handleCreatePool = async ({
    params,
}: {
    params: [string, string, string, string, string, string, ConnectedWallet[]]
}) => {
    const [timeStart, timeEnd, poolName, depositAmountPerPerson, penaltyFeeRate, token, wallets] = params

    console.log('penaltyFeeRate', penaltyFeeRate)
    const walletAddress = wallets[0].address
    const wallet = wallets[0]

    let createPoolDataString = poolIFace.encodeFunctionData('createPool', [
        timeStart,
        timeEnd,
        poolName,
        depositAmountPerPerson,
        penaltyFeeRate,
        token,
    ])

    try {
        const provider = await wallet.getEthereumProvider()
        const signedTxn = await provider.request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: walletAddress,
                    to: contractAddress,
                    data: createPoolDataString,
                },
            ],
        })
        let transactionReceipt = null
        while (transactionReceipt === null) {
            transactionReceipt = await provider.request({
                method: 'eth_getTransactionReceipt',
                params: [signedTxn],
            })
            await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds before checking again
        }
        console.log('Transaction confirmed!', transactionReceipt)
    } catch (e: any) {
        console.log('User did not sign transaction')
        return
    }
}

export interface PoolEntity {
    bannerImageBase64: string // base 64 encoded image
    poolName: string
    description: string
    dateTimeStart: string
    dateTimeEnd: string
}

export const handleCreatePoolServer = async ({
    params,
}: {
    params: [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string[],
        string,
        string,
    ]
}) => {
    const [
        fileName,
        fileType,
        fileBase64,
        timeStart,
        timeEnd,
        poolName,
        description,
        price,
        softCap,
        penalty,
        tokenAddr,
        host,
        coHosts,
        termsUrl,
        jwt,
    ] = params

    let dataObj = {
        fileName,
        fileType,
        fileBase64,
        timeStart,
        timeEnd,
        poolName,
        description,
        price,
        softCap,
        penalty,
        tokenAddr,
        host,
        coHosts,
        termsUrl,
        jwtString: jwt,
    }

    try {
        const response = await fetch('/api/create_pool', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataObj),
        })

        if (response.ok) {
            const data = await response.json()
        } else {
            console.error('Error uploading file')
        }
    } catch (error) {
        console.error('Error uploading file:', error)
    }
}

export const handleOnRamp = async ({ params }: { params: [string, string] }) => {
    const [chainName, jwt] = params

    let dataObj = { chainName, jwtString: jwt }
    try {
        const response = await fetch('/api/on_ramp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataObj),
        })
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error('There was a problem with the post operation:', error)
    }
}

export const handleOnRampByPaySDK = async ({ params }: { params: [string, string] }) => {
    const [chainName, jwt] = params

    let dataObj = { chainName, jwtString: jwt }
    try {
        const response = await fetch('/api/on_ramp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataObj),
        })
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error('There was a problem with the post operation:', error)
    }
}

// export const handleCreatePoolServer = async ({
// 	params,
// }: {
// 	params: [string, string, string, string, string, string, ConnectedWallet[]]
// }) => {
// 	const [
// 		timeStart,
// 		timeEnd,
// 		poolName,
// 		depositAmountPerPerson,
// 		penaltyFeeRate,
// 		token,
// 		wallets,
// 	] = params

// 	const walletAddress = wallets[0].address
// 	const wallet = wallets[0]
// }