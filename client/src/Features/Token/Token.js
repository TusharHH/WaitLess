import React, { useEffect, useState } from 'react';
import useTokenStore from '../../store/tokenStore.js';
import './TokenDetails.scss';

const TokenDetails = () => {
    const { token, fetchTokenById, isLoading, error } = useTokenStore();
    const [hasClicked, setHasClicked] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchData = async () => {
            await fetchTokenById(user._id);
            setHasClicked(true);
        };
        fetchData();
    }, [fetchTokenById, user._id]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const latestToken = token?.[token.length - 1]; 
    const tokenHistory = token?.slice(0, token.length - 1);

    return (
        <div className="token-container">
            {hasClicked && (
                <div>
                    {latestToken ? (
                        <div className="token-card">
                            <h2>Latest Token</h2>
                            <div className="token-details">
                                <h3>Token Number: {latestToken.tokenNumber}</h3>
                                <p>User: {latestToken.user.name}</p>
                                <p>Service: {latestToken.service?.name}</p>
                                <p>Registration Queue Position: {latestToken.registrationQueuePosition}</p>
                                <p>Service Queue Position: {latestToken.serviceQueuePosition}</p>
                                <p>Status: {latestToken.status}</p>
                                <p>Estimated Wait Time: {latestToken.estimatedWaitTime} minutes</p>
                                <p>Admin Name: {latestToken.service?.admin?.name} </p>
                                <p>Admin Email: {latestToken.service?.admin?.email} </p>
                            </div>
                        </div>
                    ) : (
                        <div>No latest token found</div>
                    )}

                    <h2>Token History</h2>
                    <div className="token-history-grid">
                        {tokenHistory && tokenHistory.length > 0 ? (
                            tokenHistory.map((tkn, index) => (
                                <div key={index} className="token-card">
                                    <h3>Token Number: {tkn.tokenNumber}</h3>
                                    <div className="token-details">
                                        <p>User: {tkn.user.name}</p>
                                        <p>Service: {tkn.service?.name}</p>
                                        <p>Registration Queue Position: {tkn.registrationQueuePosition}</p>
                                        <p>Service Queue Position: {tkn.serviceQueuePosition}</p>
                                        <p>Status: {tkn.status}</p>
                                        <p>Estimated Wait Time: {tkn.estimatedWaitTime} minutes</p>
                                        <p>Admin Name: {tkn.service?.admin?.name} </p>
                                        <p>Admin Email: {tkn.service?.admin?.email} </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>No token history available</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TokenDetails;
