import React, { memo } from 'react';

const FooterComponent: React.FC = () => {
    return (
        <footer className="footer">
            <span className="footer__block">DURIIN'S CHANNEL NODE</span>
            <span className="footer__block footer__block--muted">
                Built with React + Vite. Signal stays lean and fast.
            </span>
        </footer>
    );
};

export const Footer = memo(FooterComponent);
Footer.displayName = 'Footer';
