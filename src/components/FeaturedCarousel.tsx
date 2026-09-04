import React, { memo, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FeaturedTopic } from '../content/types';
import { useTheme } from '../theme/ThemeContext';

export type FeaturedCarouselProps = {
    items: FeaturedTopic[];
};

const isExternalHref = (href: string) => /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//');

const FeaturedCarouselComponent: React.FC<FeaturedCarouselProps> = ({ items }) => {
    const { layout } = useTheme();
    const [activeIndex, setActiveIndex] = useState(0);

    const topics = useMemo(
        () => items.filter((topic): topic is FeaturedTopic => Boolean(topic)),
        [items]
    );
    const total = topics.length;

    if (!total) {
        return null;
    }

    const clampIndex = (index: number) => {
        const nextIndex = (index + total) % total;
        return nextIndex;
    };

    const goTo = (index: number) => {
        setActiveIndex(clampIndex(index));
    };

    const handlePrev = () => goTo(activeIndex - 1);
    const handleNext = () => goTo(activeIndex + 1);
    const currentIndex = clampIndex(activeIndex);
    const activeTopic = topics[currentIndex];

    return (
        <section
            className={`featured-carousel c-panel u-stack featured-carousel--${layout}`}
            aria-label="Featured highlights"
        >
            <div className="featured-carousel__stage">
                <button
                    type="button"
                    className="featured-carousel__nav featured-carousel__nav--prev"
                    onClick={handlePrev}
                    aria-label="Show previous highlight"
                >
                    <span aria-hidden="true">◀</span>
                </button>
                <div className="featured-carousel__viewport">
                    <article key={activeTopic.id} className="featured-carousel__slide is-active">
                        <div className="featured-carousel__media">
                            <img
                                src={activeTopic.image}
                                alt={activeTopic.title}
                                loading="lazy"
                                decoding="async"
                                width="1280"
                                height="720"
                            />
                        </div>
                        <div className="featured-carousel__body">
                            <p className="featured-carousel__eyebrow u-text-caption">FEATURED HIGHLIGHTS</p>
                            <h2 className="featured-carousel__title u-text-heading-lg">{activeTopic.title}</h2>
                            <p className="featured-carousel__description u-text-body">
                                {activeTopic.description}
                            </p>
                            {isExternalHref(activeTopic.href) ? (
                                <a
                                    href={activeTopic.href}
                                    className="featured-carousel__cta"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {activeTopic.ctaLabel ?? 'Open in spotlight'}
                                </a>
                            ) : (
                                <Link to={activeTopic.href} className="featured-carousel__cta">
                                    {activeTopic.ctaLabel ?? 'Open in spotlight'}
                                </Link>
                            )}
                        </div>
                    </article>
                </div>
                <button
                    type="button"
                    className="featured-carousel__nav featured-carousel__nav--next"
                    onClick={handleNext}
                    aria-label="Show next highlight"
                >
                    <span aria-hidden="true">▶</span>
                </button>
            </div>

            <div className="featured-carousel__indicators" role="group" aria-label="Featured highlight selector">
                {topics.map((topic, index) => (
                    <button
                        key={topic.id}
                        type="button"
                        aria-pressed={index === currentIndex}
                        aria-label={`Show highlight ${topic.title}`}
                        className={`featured-carousel__indicator ${index === currentIndex ? 'is-active' : ''}`}
                        onClick={() => goTo(index)}
                    />
                ))}
            </div>
        </section>
    );
};

export const FeaturedCarousel = memo(FeaturedCarouselComponent);
FeaturedCarousel.displayName = 'FeaturedCarousel';
