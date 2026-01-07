export interface Comment {
  id: string;
  animeId: string;
  episodeId?: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  createdAt: Date;
  likes: number;
  replies: Comment[];
}

export const mockComments: Comment[] = [
  {
    id: '1',
    animeId: '1',
    userId: 'user1',
    username: 'AnimeKing',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AnimeKing',
    content: 'This anime is absolutely amazing! The animation quality is top-notch.',
    createdAt: new Date('2024-01-15'),
    likes: 42,
    replies: [
      {
        id: '1-1',
        animeId: '1',
        userId: 'user2',
        username: 'OtakuMaster',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=OtakuMaster',
        content: 'Totally agree! MAPPA really outdid themselves.',
        createdAt: new Date('2024-01-16'),
        likes: 15,
        replies: [],
      },
    ],
  },
  {
    id: '2',
    animeId: '1',
    userId: 'user3',
    username: 'SakuraFan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SakuraFan',
    content: 'The fight scenes in this season are insane! Worth every second.',
    createdAt: new Date('2024-01-14'),
    likes: 28,
    replies: [],
  },
  {
    id: '3',
    animeId: '1',
    userId: 'user4',
    username: 'NightOwl',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NightOwl',
    content: 'Been waiting for this season for so long. Not disappointed at all!',
    createdAt: new Date('2024-01-13'),
    likes: 19,
    replies: [],
  },
];

export const getCommentsForAnime = (animeId: string): Comment[] => {
  return mockComments.filter(c => c.animeId === animeId);
};
