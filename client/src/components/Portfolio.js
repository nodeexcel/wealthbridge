import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Portfolio = () => {
    const [portfolioData, setPortfolioData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                const response = await axios.get('/api/portfolio');
                setPortfolioData(response.data);
            } catch (err) {
                setError('Error fetching portfolio data');
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolioData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Portfolio Tracking</h1>
            <table>
                <thead>
                    <tr>
                        <th>Asset</th>
                        <th>Quantity</th>
                        <th>Current Price</th>
                        <th>Total Value</th>
                    </tr>
                </thead>
                <tbody>
                    {portfolioData.map((asset) => (
                        <tr key={asset.id}>
                            <td>{asset.name}</td>
                            <td>{asset.quantity}</td>
                            <td>${asset.currentPrice.toFixed(2)}</td>
                            <td>${(asset.quantity * asset.currentPrice).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Portfolio;