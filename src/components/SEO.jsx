'use client';

import { Helmet } from 'react-helmet-async';
import { usePathname } from 'next/navigation';

const SEO = ({ title, description, keywords, image }) => {
    const pathname = usePathname();
    const siteName = "UzAuto TRAILER";
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const baseUrl = "https://uzautotrailer.uz"; 
    const currentUrl = `${baseUrl}${pathname}`;

    // Rasm yo'lini tekshirish (To'liq URL bo'lishi shart)
    const seoImage = image?.startsWith('http') ? image : `${baseUrl}${image || '/logo.png'}`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={currentUrl} />

            <meta property="og:site_name" content={siteName} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:image" content={seoImage} />
            <meta property="og:type" content="website" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={seoImage} />

            <meta name="robots" content="index, follow" />
        </Helmet>
    );
};

export default SEO;