import React from 'react';

import RecentPage from '../screens/RecentPage';
import SeriesPage from '../screens/SeriesPage';
import routes from './routes';
import VideoPage from '../screens/VideoPage';
import HomePage from '../screens/HomePage';
import RecordPage from '../screens/RecordPage';
import BangumiPage from '../screens/BangumiPage';
import SeasonPage from '../screens/SeasonPage';

const componentForRoute = (routeKey: string, props: any) => {
    switch (routeKey) {
        case routes.Home.key:
            return <HomePage {...props} />;
        case routes.Recent.key:
            return <RecentPage {...props} />;
        case routes.Series.key:
            return <SeriesPage {...props} />;
        case routes.Video.key:
            return <VideoPage {...props} />;
        case routes.Record.key:
            return <RecordPage {...props} />;
        case routes.Bangumi.key:
            return <BangumiPage {...props} />;
        case routes.Season.key:
            return <SeasonPage {...props} />;
    }
};


export default componentForRoute;
