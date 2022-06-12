import React from 'react'
import { Helmet } from 'react-helmet'   // used for custom page title

const Meta = ({ title, description, keywords }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name='description' content={description} />
            <meta name='keyword' content={keywords} />
        </Helmet>
    )
}

Meta.defaultProps = {
    title: 'Welcome To Tradegaroo',
    description: 'We sell the best products in Australia',
    keywords: 'electronics, clothing, accessories, sports, health, beauty, toy',
}

export default Meta