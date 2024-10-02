import React, { useState } from 'react';
import useTokenStore from '../../store/tokenStore.js';

const TokenDetails = () => {
    const { token, fetchTokenById, isLoading, error } = useTokenStore(); // assuming tokens is an array
    const [hasClicked, setHasClicked] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));

    

    const handleFetchToken = async () => {
        await fetchTokenById(user._id);
        setHasClicked(true);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <button onClick={handleFetchToken}>Check Tokens</button>

            {hasClicked && (
                <div>
                    {token && token.length > 0 ? (
                        token.map((token, index) => (
                            <div key={index}>
                                <h2>Token Number: {token.tokenNumber}</h2>
                                <p>User: {token.user.name}</p>
                                <p>Service: {token.service.name}</p>
                                <p>Registration Queue Position: {token.registrationQueuePosition}</p>
                                <p>Service Queue Position: {token.serviceQueuePosition}</p>
                                <p>Status: {token.status}</p>
                                <p>Estimated Wait Time: {token.estimatedWaitTime} minutes</p>
                                <hr />
                            </div>
                        ))
                    ) : (
                        <div>No tokens found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TokenDetails;
