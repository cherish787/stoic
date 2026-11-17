import type { Quote } from '../types';

/**
 * Curated Stoic quotations. Sources are cited by book/section.
 * Wording follows widely used public-domain translations (George Long, Richard Mott Gummere,
 * Elizabeth Carter, P. E. Matheson) or common modern renderings where noted.
 */
export const QUOTES: Quote[] = [
  {
    id: 'q01',
    text: 'You have power over your mind — not outside events. Realize this, and you will find strength.',
    author: 'Marcus Aurelius',
    source: 'Meditations — popular rendering',
  },
  {
    id: 'q02',
    text: 'We suffer more often in imagination than in reality.',
    author: 'Seneca',
    source: 'Letters to Lucilius, 13',
  },
  {
    id: 'q03',
    text: 'First say to yourself what you would be; and then do what you have to do.',
    author: 'Epictetus',
    source: 'Discourses, III.23',
  },
  {
    id: 'q04',
    text: 'Waste no more time arguing about what a good man should be. Be one.',
    author: 'Marcus Aurelius',
    source: 'Meditations, X.16',
  },
  {
    id: 'q05',
    text: 'The impediment to action advances action. What stands in the way becomes the way.',
    author: 'Marcus Aurelius',
    source: 'Meditations, V.20',
  },
  {
    id: 'q06',
    text: 'It is not that we have a short time to live, but that we waste a lot of it.',
    author: 'Seneca',
    source: 'On the Shortness of Life, I',
  },
  {
    id: 'q07',
    text: 'No great thing is created suddenly.',
    author: 'Epictetus',
    source: 'Discourses, I.15',
  },
  {
    id: 'q08',
    text: 'Such as are your habitual thoughts, such also will be the character of your mind; for the soul is dyed by the thoughts.',
    author: 'Marcus Aurelius',
    source: 'Meditations, V.16',
  },
  {
    id: 'q09',
    text: 'While we are postponing, life speeds by.',
    author: 'Seneca',
    source: 'Letters to Lucilius, 1',
  },
  {
    id: 'q10',
    text: 'Men are disturbed not by things, but by the opinions about things.',
    author: 'Epictetus',
    source: 'Enchiridion, 5',
  },
  {
    id: 'q11',
    text: 'If it is not right, do not do it; if it is not true, do not say it.',
    author: 'Marcus Aurelius',
    source: 'Meditations, XII.17',
  },
  {
    id: 'q12',
    text: 'If a man knows not to which port he sails, no wind is favorable.',
    author: 'Seneca',
    source: 'Letters to Lucilius, 71',
  },
  {
    id: 'q13',
    text: 'No man is free who is not master of himself.',
    author: 'Epictetus',
    source: 'Fragments',
  },
  {
    id: 'q14',
    text: 'Very little is needed to make a happy life; it is all within yourself, in your way of thinking.',
    author: 'Marcus Aurelius',
    source: 'Meditations, VII.67',
  },
  {
    id: 'q15',
    text: 'Begin at once to live, and count each separate day as a separate life.',
    author: 'Seneca',
    source: 'Letters to Lucilius, 101',
  },
  {
    id: 'q16',
    text: 'It is difficulties that show what men are.',
    author: 'Epictetus',
    source: 'Discourses, I.24',
  },
  {
    id: 'q17',
    text: 'Confine yourself to the present.',
    author: 'Marcus Aurelius',
    source: 'Meditations, VII.29',
  },
  {
    id: 'q18',
    text: 'No man was ever wise by chance.',
    author: 'Seneca',
    source: 'Letters to Lucilius, 76',
  },
  {
    id: 'q19',
    text: 'If you wish to improve, be content to appear foolish and stupid.',
    author: 'Epictetus',
    source: 'Enchiridion, 13',
  },
  {
    id: 'q20',
    text: 'The best revenge is not to be like your enemy.',
    author: 'Marcus Aurelius',
    source: 'Meditations, VI.6',
  },
  {
    id: 'q21',
    text: 'Fire tests gold, suffering tests brave men.',
    author: 'Seneca',
    source: 'On Providence, V',
  },
  {
    id: 'q22',
    text: 'Some things are within our power, while others are not.',
    author: 'Epictetus',
    source: 'Enchiridion, 1',
  },
];

export const COMPLETION_MESSAGES: Record<'focus' | 'train' | 'rest', string[]> = {
  focus: [
    'The battle is won. Your mind held the line.',
    'Victory belongs to the one who stayed.',
    'One more stone laid in the wall of character.',
    'You did the work in front of you. That is enough.',
  ],
  train: [
    'The body obeys. Discipline is forged.',
    'Sweat today, steadiness tomorrow.',
    'Legions were built one drill at a time.',
    'Strength earned, not wished for.',
  ],
  rest: [
    'Rested and ready. Return to your post.',
    'The bow that is always bent will break. You chose wisely.',
    'Recovery is part of the campaign.',
    'Breathe. The next battle is closer than you think.',
  ],
};
