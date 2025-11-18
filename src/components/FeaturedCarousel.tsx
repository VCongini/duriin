import React, { useMemo, useState } from 'react';
import { FeaturedTopic } from '../content/types';
import { useTheme } from '../theme/ThemeContext';

export type FeaturedCarouselProps = {
    items: FeaturedTopic[];
};

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ items }) => {
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

    return (
        <section className={`featured-carousel featured-carousel--${layout}`} aria-label="Featured topics">
            <div className="featured-carousel__stage">
                <button
                    type="button"
                    className="featured-carousel__nav featured-carousel__nav--prev"
                    onClick={handlePrev}
                    aria-label="Show previous featured topic"
                >
                    <span aria-hidden="true">◀</span>
                </button>
                <div className="featured-carousel__viewport">
                    {topics.map((topic, index) => (
                        <article
                            key={topic.id}
                            className={`featured-carousel__slide ${index === activeIndex ? 'is-active' : ''}`}
                            aria-hidden={index !== activeIndex}
                        >
                            <div className="featured-carousel__media">
                                <img src={topic.image} alt={topic.title} loading="lazy" />
                            </div>
                            <div className="featured-carousel__body">
                                <p className="featured-carousel__eyebrow">FEATURED</p>
                                <h3 className="featured-carousel__title">{topic.title}</h3>
                                <p className="featured-carousel__description">{topic.description}</p>
                                <a href={topic.href} className="featured-carousel__cta">
                                    {topic.ctaLabel ?? 'Explore topic'}
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
                <button
                    type="button"
                    className="featured-carousel__nav featured-carousel__nav--next"
                    onClick={handleNext}
                    aria-label="Show next featured topic"
                >
                    <span aria-hidden="true">▶</span>
                </button>
            </div>

            <div className="featured-carousel__indicators" role="tablist" aria-label="Featured topic selector">
                {topics.map((topic, index) => (
                    <button
                        key={topic.id}
                        type="button"
                        role="tab"
                        aria-selected={index === activeIndex}
                        aria-label={`Show ${topic.title}`}
                        className={`featured-carousel__indicator ${index === activeIndex ? 'is-active' : ''}`}
                        onClick={() => goTo(index)}
                    />
                ))}
            </div>
        </section>
    );
};
