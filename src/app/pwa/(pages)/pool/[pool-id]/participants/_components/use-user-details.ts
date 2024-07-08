import { useQuery } from '@tanstack/react-query'
import { fetchUserDetailsFromDB } from './fetch-db-user-details'

export const useUserDetailsDB = (address: string) => {
    const {
        data: userDetailsDB,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['userDetailsDB', address],
        queryFn: fetchUserDetailsFromDB,
    })

    return { userDetailsDB, isLoading, error }
}
