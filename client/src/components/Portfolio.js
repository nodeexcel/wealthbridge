import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Portfolio = () => {
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                const response = await axios.get('/api/portfolios');
                setPortfolios(response.data);
            } catch (err) {
                setError('Failed to fetch portfolios');
            } finally {
                setLoading(false);
            }
        };
        fetchPortfolios();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/portfolios/${id}`);
            setPortfolios(portfolios.filter(portfolio => portfolio._id !== id));
        } catch (err) {
            setError('Failed to delete portfolio');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>User Portfolios</h1>
            <ul>
                {portfolios.map(portfolio => (
                    <li key={portfolio._id}>
                        <h2>{portfolio.name}</h2>
                        <p>{portfolio.description}</p>
                        <button onClick={() => handleDelete(portfolio._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Portfolio;