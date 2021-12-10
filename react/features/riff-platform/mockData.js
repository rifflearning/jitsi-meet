const mockEmotionsData = [
    {
        '_id': '5fc4f6bbfed14649e9fa1b3d',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:42:06.720Z',
        'compound': 'Dispair',
        'classification': -0.82
    },
    {
        '_id': '5fc4f6bbfed14649e9fa1b3e',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:42:07.276Z',
        'compound': 'Sadness',
        'classification': -0.86
    },
    {
        '_id': '5fc4f6bbfed14649e9fa1b3f',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:42:08.083Z',
        'compound': 'Anger',
        'classification': -0.74
    },
    {
        '_id': '5fc4f6bbfed14649e9fa1b40',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:42:08.676Z',
        'compound': 'Sentimentality',
        'classification': -0.18
    },
    {
        '_id': '5fc4f6bbfed14649e9fa1b41',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:42:09.375Z',
        'compound': 'Envy',
        'classification': -0.8
    },
    {
        '_id': '5fc4f6bbfed14649e9fa1b42',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:42:09.954Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f6bbfed14649e9fa1b43',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:42:11.025Z',
        'compound': 'Envy',
        'classification': -0.7
    },
    {
        '_id': '5fc4f6bbfed14649e9fa1b44',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:42:11.626Z',
        'compound': 'Neutral',
        'classification': -0.14
    },
    {
        '_id': '5fc4f6bbfed14649e9fa1b45',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:42:12.421Z',
        'compound': 'Envy',
        'classification': -0.79
    },
    {
        '_id': '5fc4f6bbfed14649e9fa1b46',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:42:13.035Z',
        'compound': 'Sadness',
        'classification': -0.86
    },
    {
        '_id': '5fc4f6bbfed14649e9fa1b47',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:42:13.858Z',
        'compound': 'Envy',
        'classification': -0.81
    },
    {
        '_id': '5fc4f6bbfed14649e9fa1b48',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:42:14.496Z',
        'compound': 'Love',
        'classification': 0.53
    },
    {
        '_id': '5fc4f6bbfed14649e9fa1b49',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:42:15.487Z',
        'compound': 'Envy',
        'classification': -0.77
    },
    {
        '_id': '5fc4f6bbfed14649e9fa1b4a',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:42:15.489Z',
        'compound': 'Envy',
        'classification': -0.68
    },
    {
        '_id': '5fc4f6bbfed14649e9fa1b4b',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:42:16.307Z',
        'compound': 'Sadness',
        'classification': -0.86
    },
    {
        '_id': '5fc4f6bbfed14649e9fa1b4c',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:42:16.914Z',
        'compound': 'Sadness',
        'classification': -0.72
    },
    {
        '_id': '5fc4f6bbfed14649e9fa1b4d',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:42:17.690Z',
        'compound': 'Dispair',
        'classification': -0.78
    },
    {
        '_id': '5fc4f6bbfed14649e9fa1b4e',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:42:18.303Z',
        'compound': 'Remorse',
        'classification': -0.57
    },
    {
        '_id': '5fc4f6bbfed14649e9fa1b4f',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:42:19.248Z',
        'compound': 'Envy',
        'classification': -0.85
    },
    {
        '_id': '5fc4f6bbfed14649e9fa1b50',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:42:19.250Z',
        'compound': 'Sadness',
        'classification': -0.85
    },
    {
        '_id': '5fc4f6ecfed14649e9fa1b51',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:42:20.060Z',
        'compound': 'Sadness',
        'classification': -0.73
    },
    {
        '_id': '5fc4f6ecfed14649e9fa1b52',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:42:20.461Z',
        'compound': 'Shame',
        'classification': -0.57
    },
    {
        '_id': '5fc4f6ecfed14649e9fa1b53',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:42:21.210Z',
        'compound': 'Envy',
        'classification': -0.81
    },
    {
        '_id': '5fc4f6ecfed14649e9fa1b54',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:42:21.730Z',
        'compound': 'Dominance',
        'classification': -0.13
    },
    {
        '_id': '5fc4f6ecfed14649e9fa1b55',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:42:22.335Z',
        'compound': 'Dispair',
        'classification': -0.79
    },
    {
        '_id': '5fc4f6ecfed14649e9fa1b56',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:42:22.972Z',
        'compound': 'Sentimentality',
        'classification': -0.24
    },
    {
        '_id': '5fc4f6ecfed14649e9fa1b57',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:42:23.829Z',
        'compound': 'Sadness',
        'classification': -0.69
    },
    {
        '_id': '5fc4f6ecfed14649e9fa1b58',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:42:24.732Z',
        'compound': 'Dispair',
        'classification': -0.92
    },
    {
        '_id': '5fc4f6ecfed14649e9fa1b59',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:42:24.734Z',
        'compound': 'Sadness',
        'classification': -0.81
    },
    {
        '_id': '5fc4f6ecfed14649e9fa1b5a',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:42:25.338Z',
        'compound': 'Envy',
        'classification': -0.75
    },
    {
        '_id': '5fc4f6ecfed14649e9fa1b5b',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:42:26.227Z',
        'compound': 'Dispair',
        'classification': -0.82
    },
    {
        '_id': '5fc4f6ecfed14649e9fa1b5c',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:42:27.070Z',
        'compound': 'Dispair',
        'classification': -0.91
    },
    {
        '_id': '5fc4f6ecfed14649e9fa1b5d',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:42:40.211Z',
        'compound': 'Anger',
        'classification': -0.84
    },
    {
        '_id': '5fc4f6ecfed14649e9fa1b5e',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:42:41.160Z',
        'compound': 'Sadness',
        'classification': -0.85
    },
    {
        '_id': '5fc4f6ecfed14649e9fa1b5f',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:42:42.130Z',
        'compound': 'Sadness',
        'classification': -0.82
    },
    {
        '_id': '5fc4f6ecfed14649e9fa1b60',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:42:43.052Z',
        'compound': 'Envy',
        'classification': -0.79
    },
    {
        '_id': '5fc4f6ecfed14649e9fa1b61',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:03.007Z',
        'compound': 'Anger',
        'classification': -0.7
    },
    {
        '_id': '5fc4f6ecfed14649e9fa1b62',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:06.969Z',
        'compound': 'Fear',
        'classification': -0.95
    },
    {
        '_id': '5fc4f6ecfed14649e9fa1b63',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:08.044Z',
        'compound': 'Dominance',
        'classification': -0.15
    },
    {
        '_id': '5fc4f6ecfed14649e9fa1b64',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:08.978Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f70ffed14649e9fa1b65',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:09.864Z',
        'compound': 'Sadness',
        'classification': -0.91
    },
    {
        '_id': '5fc4f70ffed14649e9fa1b66',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:10.574Z',
        'compound': 'Sadness',
        'classification': -0.97
    },
    {
        '_id': '5fc4f70ffed14649e9fa1b67',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:12.273Z',
        'compound': 'Anger',
        'classification': -0.78
    },
    {
        '_id': '5fc4f70ffed14649e9fa1b68',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:13.186Z',
        'compound': 'Anger',
        'classification': -0.7
    },
    {
        '_id': '5fc4f70ffed14649e9fa1b69',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:14.077Z',
        'compound': 'Anger',
        'classification': -0.71
    },
    {
        '_id': '5fc4f70ffed14649e9fa1b6a',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:15.017Z',
        'compound': 'Anger',
        'classification': -0.76
    },
    {
        '_id': '5fc4f70ffed14649e9fa1b6b',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:15.919Z',
        'compound': 'Dispair',
        'classification': -0.55
    },
    {
        '_id': '5fc4f70ffed14649e9fa1b6c',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:20.402Z',
        'compound': 'Sadness',
        'classification': -0.99
    },
    {
        '_id': '5fc4f70ffed14649e9fa1b6d',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:21.509Z',
        'compound': 'Sentimentality',
        'classification': -0.21
    },
    {
        '_id': '5fc4f70ffed14649e9fa1b6e',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:22.636Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f70ffed14649e9fa1b6f',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:23.226Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f70ffed14649e9fa1b70',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:24.145Z',
        'compound': 'Despair',
        'classification': -0.8
    },
    {
        '_id': '5fc4f70ffed14649e9fa1b71',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:25.179Z',
        'compound': 'Sadness',
        'classification': -0.97
    },
    {
        '_id': '5fc4f70ffed14649e9fa1b72',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:26.053Z',
        'compound': 'Envy',
        'classification': -0.88
    },
    {
        '_id': '5fc4f70ffed14649e9fa1b73',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:27.003Z',
        'compound': 'Envy',
        'classification': -0.67
    },
    {
        '_id': '5fc4f70ffed14649e9fa1b74',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:27.572Z',
        'compound': 'Envy',
        'classification': -0.77
    },
    {
        '_id': '5fc4f70ffed14649e9fa1b75',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:28.953Z',
        'compound': 'Sadness',
        'classification': -0.77
    },
    {
        '_id': '5fc4f70ffed14649e9fa1b76',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:29.868Z',
        'compound': 'Sadness',
        'classification': -0.81
    },
    {
        '_id': '5fc4f70ffed14649e9fa1b77',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:37.854Z',
        'compound': 'Sadness',
        'classification': -0.83
    },
    {
        '_id': '5fc4f70ffed14649e9fa1b78',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:43.907Z',
        'compound': 'Envy',
        'classification': -0.86
    },
    {
        '_id': '5fc4f75cfed14649e9fa1b79',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:44.513Z',
        'compound': 'Envy',
        'classification': -0.77
    },
    {
        '_id': '5fc4f75cfed14649e9fa1b7a',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:57.115Z',
        'compound': 'Sadness',
        'classification': -0.68
    },
    {
        '_id': '5fc4f75cfed14649e9fa1b7b',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:58.279Z',
        'compound': 'Sadness',
        'classification': -0.89
    },
    {
        '_id': '5fc4f75cfed14649e9fa1b7c',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:43:59.050Z',
        'compound': 'Envy',
        'classification': -0.88
    },
    {
        '_id': '5fc4f75cfed14649e9fa1b7d',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:44:23.415Z',
        'compound': 'Sadness',
        'classification': -0.92
    },
    {
        '_id': '5fc4f75cfed14649e9fa1b7e',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:44:24.446Z',
        'compound': 'Sadness',
        'classification': -0.95
    },
    {
        '_id': '5fc4f75cfed14649e9fa1b7f',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:44:28.476Z',
        'compound': 'Guilt',
        'classification': 0.24
    },
    {
        '_id': '5fc4f75cfed14649e9fa1b80',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:44:29.601Z',
        'compound': 'Sadness',
        'classification': -0.34
    },
    {
        '_id': '5fc4f75cfed14649e9fa1b81',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:44:30.582Z',
        'compound': 'Sadness',
        'classification': -0.85
    },
    {
        '_id': '5fc4f75cfed14649e9fa1b82',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:44:31.561Z',
        'compound': 'Guilt',
        'classification': -0.13
    },
    {
        '_id': '5fc4f75cfed14649e9fa1b83',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:44:32.455Z',
        'compound': 'Despair',
        'classification': -0.84
    },
    {
        '_id': '5fc4f75cfed14649e9fa1b84',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:44:33.268Z',
        'compound': 'Despair',
        'classification': -0.84
    },
    {
        '_id': '5fc4f75cfed14649e9fa1b85',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:44:41.415Z',
        'compound': 'Anger',
        'classification': -0.7
    },
    {
        '_id': '5fc4f75cfed14649e9fa1b86',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:44:54.285Z',
        'compound': 'Remorse',
        'classification': -0.56
    },
    {
        '_id': '5fc4f75cfed14649e9fa1b87',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:44:55.162Z',
        'compound': 'Despair',
        'classification': -0.88
    },
    {
        '_id': '5fc4f75cfed14649e9fa1b88',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:44:56.000Z',
        'compound': 'Despair',
        'classification': -0.92
    },
    {
        '_id': '5fc4f75cfed14649e9fa1b89',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:44:56.805Z',
        'compound': 'Despair',
        'classification': -0.79
    },
    {
        '_id': '5fc4f75cfed14649e9fa1b8a',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:44:58.337Z',
        'compound': 'Despair',
        'classification': -0.75
    },
    {
        '_id': '5fc4f75cfed14649e9fa1b8b',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:44:59.492Z',
        'compound': 'Remorse',
        'classification': -0.61
    },
    {
        '_id': '5fc4f75cfed14649e9fa1b8c',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:00.415Z',
        'compound': 'Happiness',
        'classification': 0.11
    },
    {
        '_id': '5fc4f783fed14649e9fa1b8d',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:01.495Z',
        'compound': 'Envy',
        'classification': -0.75
    },
    {
        '_id': '5fc4f783fed14649e9fa1b8e',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:02.441Z',
        'compound': 'Sadness',
        'classification': -0.72
    },
    {
        '_id': '5fc4f783fed14649e9fa1b8f',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:03.412Z',
        'compound': 'Sentimentality',
        'classification': -0.15
    },
    {
        '_id': '5fc4f783fed14649e9fa1b90',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:05.336Z',
        'compound': 'Dispair',
        'classification': -0.96
    },
    {
        '_id': '5fc4f783fed14649e9fa1b91',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:06.305Z',
        'compound': 'Fear',
        'classification': -0.74
    },
    {
        '_id': '5fc4f783fed14649e9fa1b92',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:08.373Z',
        'compound': 'Sadness',
        'classification': -0.97
    },
    {
        '_id': '5fc4f783fed14649e9fa1b93',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:08.968Z',
        'compound': 'Sadness',
        'classification': -0.98
    },
    {
        '_id': '5fc4f783fed14649e9fa1b94',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:29.159Z',
        'compound': 'Sadness',
        'classification': -0.75
    },
    {
        '_id': '5fc4f783fed14649e9fa1b95',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:30.033Z',
        'compound': 'Sadness',
        'classification': -0.99
    },
    {
        '_id': '5fc4f783fed14649e9fa1b96',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:30.953Z',
        'compound': 'Remorse',
        'classification': -0.68
    },
    {
        '_id': '5fc4f783fed14649e9fa1b97',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:31.832Z',
        'compound': 'Remorse',
        'classification': -0.73
    },
    {
        '_id': '5fc4f783fed14649e9fa1b98',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:32.689Z',
        'compound': 'Sadness',
        'classification': -0.95
    },
    {
        '_id': '5fc4f783fed14649e9fa1b99',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:33.796Z',
        'compound': 'Sadness',
        'classification': -0.94
    },
    {
        '_id': '5fc4f783fed14649e9fa1b9a',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:34.638Z',
        'compound': 'Sadness',
        'classification': -0.88
    },
    {
        '_id': '5fc4f783fed14649e9fa1b9b',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:35.504Z',
        'compound': 'Sentimentality',
        'classification': -0.17
    },
    {
        '_id': '5fc4f783fed14649e9fa1b9c',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:36.375Z',
        'compound': 'Sadness',
        'classification': -0.71
    },
    {
        '_id': '5fc4f783fed14649e9fa1b9d',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:37.393Z',
        'compound': 'Despair',
        'classification': -0.81
    },
    {
        '_id': '5fc4f783fed14649e9fa1b9e',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:37.979Z',
        'compound': 'Despair',
        'classification': -0.71
    },
    {
        '_id': '5fc4f783fed14649e9fa1b9f',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:38.854Z',
        'compound': 'Remorse',
        'classification': -0.86
    },
    {
        '_id': '5fc4f783fed14649e9fa1ba0',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:39.701Z',
        'compound': 'Sadness',
        'classification': -0.8
    },
    {
        '_id': '5fc4f7a6fed14649e9fa1ba1',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:40.328Z',
        'compound': 'Sadness',
        'classification': -0.99
    },
    {
        '_id': '5fc4f7a6fed14649e9fa1ba2',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:41.330Z',
        'compound': 'Dispair',
        'classification': -0.85
    },
    {
        '_id': '5fc4f7a6fed14649e9fa1ba3',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:42.367Z',
        'compound': 'Sadness',
        'classification': -0.93
    },
    {
        '_id': '5fc4f7a6fed14649e9fa1ba4',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:57.283Z',
        'compound': 'Sadness',
        'classification': -1
    },
    {
        '_id': '5fc4f7a6fed14649e9fa1ba5',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:58.410Z',
        'compound': 'Sadness',
        'classification': -0.99
    },
    {
        '_id': '5fc4f7a6fed14649e9fa1ba6',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:45:59.474Z',
        'compound': 'Sadness',
        'classification': -0.98
    },
    {
        '_id': '5fc4f7a6fed14649e9fa1ba7',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:01.076Z',
        'compound': 'Sadness',
        'classification': -0.99
    },
    {
        '_id': '5fc4f7a6fed14649e9fa1ba8',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:02.278Z',
        'compound': 'Despair',
        'classification': -0.84
    },
    {
        '_id': '5fc4f7a6fed14649e9fa1ba9',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:03.458Z',
        'compound': 'Dispair',
        'classification': -0.82
    },
    {
        '_id': '5fc4f7a6fed14649e9fa1baa',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:04.878Z',
        'compound': 'Sadness',
        'classification': -0.89
    },
    {
        '_id': '5fc4f7a6fed14649e9fa1bab',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:05.475Z',
        'compound': 'Happiness',
        'classification': 0.92
    },
    {
        '_id': '5fc4f7a6fed14649e9fa1bac',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:06.528Z',
        'compound': 'Dispair',
        'classification': -0.72
    },
    {
        '_id': '5fc4f7a6fed14649e9fa1bad',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:07.410Z',
        'compound': 'Happiness',
        'classification': 0.96
    },
    {
        '_id': '5fc4f7a6fed14649e9fa1bae',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:08.259Z',
        'compound': 'Happiness',
        'classification': 0.75
    },
    {
        '_id': '5fc4f7a6fed14649e9fa1baf',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:10.374Z',
        'compound': 'Sadness',
        'classification': -0.85
    },
    {
        '_id': '5fc4f7a6fed14649e9fa1bb0',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:11.308Z',
        'compound': 'Dispair',
        'classification': -0.76
    },
    {
        '_id': '5fc4f7a6fed14649e9fa1bb1',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:12.167Z',
        'compound': 'Sentimentality',
        'classification': -0.37
    },
    {
        '_id': '5fc4f7a6fed14649e9fa1bb2',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:13.011Z',
        'compound': 'Sentimentality',
        'classification': -0.27
    },
    {
        '_id': '5fc4f7a6fed14649e9fa1bb3',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:13.900Z',
        'compound': 'Dominance',
        'classification': -0.24
    },
    {
        '_id': '5fc4f7a6fed14649e9fa1bb4',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:14.768Z',
        'compound': 'Dominance',
        'classification': -0.38
    },
    {
        '_id': '5fc4f7bafed14649e9fa1bb5',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:15.880Z',
        'compound': 'Submission',
        'classification': -0.31
    },
    {
        '_id': '5fc4f7bafed14649e9fa1bb6',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:16.694Z',
        'compound': 'Despair',
        'classification': -0.63
    },
    {
        '_id': '5fc4f7bafed14649e9fa1bb7',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:17.424Z',
        'compound': 'Submission',
        'classification': -0.3
    },
    {
        '_id': '5fc4f7bafed14649e9fa1bb8',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:18.384Z',
        'compound': 'Submission',
        'classification': -0.29
    },
    {
        '_id': '5fc4f7bafed14649e9fa1bb9',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:19.235Z',
        'compound': 'Fear',
        'classification': -0.74
    },
    {
        '_id': '5fc4f7bafed14649e9fa1bba',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:20.331Z',
        'compound': 'Submission',
        'classification': -0.23
    },
    {
        '_id': '5fc4f7bafed14649e9fa1bbb',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:21.164Z',
        'compound': 'Fear',
        'classification': -0.7
    },
    {
        '_id': '5fc4f7bafed14649e9fa1bbc',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:22.065Z',
        'compound': 'Anger',
        'classification': -0.74
    },
    {
        '_id': '5fc4f7bafed14649e9fa1bbd',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:22.929Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f7bafed14649e9fa1bbe',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:23.783Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f7bafed14649e9fa1bbf',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:24.676Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f7bafed14649e9fa1bc0',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:25.773Z',
        'compound': 'Envy',
        'classification': -0.65
    },
    {
        '_id': '5fc4f7bafed14649e9fa1bc1',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:26.924Z',
        'compound': 'Happiness',
        'classification': 0.4
    },
    {
        '_id': '5fc4f7bafed14649e9fa1bc2',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:27.965Z',
        'compound': 'Happiness',
        'classification': 0.19
    },
    {
        '_id': '5fc4f7bafed14649e9fa1bc3',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:28.611Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f7bafed14649e9fa1bc4',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:29.553Z',
        'compound': 'Pride',
        'classification': 0.21
    },
    {
        '_id': '5fc4f7bafed14649e9fa1bc5',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:30.274Z',
        'compound': 'Sadness',
        'classification': -0.7
    },
    {
        '_id': '5fc4f7bafed14649e9fa1bc6',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:31.028Z',
        'compound': 'Envy',
        'classification': -0.67
    },
    {
        '_id': '5fc4f7bafed14649e9fa1bc7',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:32.022Z',
        'compound': 'Sadness',
        'classification': -0.72
    },
    {
        '_id': '5fc4f7bafed14649e9fa1bc8',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:34.655Z',
        'compound': 'Fear',
        'classification': -0.79
    },
    {
        '_id': '5fc4f80efed14649e9fa1bc9',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:35.572Z',
        'compound': 'Fear',
        'classification': -1
    },
    {
        '_id': '5fc4f80efed14649e9fa1bca',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:42.665Z',
        'compound': 'Remorse',
        'classification': -0.8
    },
    {
        '_id': '5fc4f80efed14649e9fa1bcb',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:43.311Z',
        'compound': 'Remorse',
        'classification': -0.83
    },
    {
        '_id': '5fc4f80efed14649e9fa1bcc',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:44.230Z',
        'compound': 'Remorse',
        'classification': -0.7
    },
    {
        '_id': '5fc4f80efed14649e9fa1bcd',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:45.080Z',
        'compound': 'Envy',
        'classification': -0.91
    },
    {
        '_id': '5fc4f80efed14649e9fa1bce',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:45.962Z',
        'compound': 'Anger',
        'classification': -0.73
    },
    {
        '_id': '5fc4f80efed14649e9fa1bcf',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:48.120Z',
        'compound': 'Fear',
        'classification': -0.96
    },
    {
        '_id': '5fc4f80efed14649e9fa1bd0',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:49.540Z',
        'compound': 'Anger',
        'classification': -0.74
    },
    {
        '_id': '5fc4f80efed14649e9fa1bd1',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:50.378Z',
        'compound': 'Envy',
        'classification': -0.82
    },
    {
        '_id': '5fc4f80efed14649e9fa1bd2',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:51.393Z',
        'compound': 'Anger',
        'classification': -0.8
    },
    {
        '_id': '5fc4f80efed14649e9fa1bd3',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:51.979Z',
        'compound': 'Fear',
        'classification': -0.97
    },
    {
        '_id': '5fc4f80efed14649e9fa1bd4',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:46:52.880Z',
        'compound': 'Fear',
        'classification': -0.79
    },
    {
        '_id': '5fc4f80efed14649e9fa1bd5',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:47:00.914Z',
        'compound': 'Sentimentality',
        'classification': -0.27
    },
    {
        '_id': '5fc4f80efed14649e9fa1bd6',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:47:01.816Z',
        'compound': 'Sentimentality',
        'classification': -0.24
    },
    {
        '_id': '5fc4f80efed14649e9fa1bd7',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:47:02.778Z',
        'compound': 'Envy',
        'classification': -0.63
    },
    {
        '_id': '5fc4f80efed14649e9fa1bd8',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:47:03.660Z',
        'compound': 'Fear',
        'classification': -0.94
    },
    {
        '_id': '5fc4f80efed14649e9fa1bd9',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:47:22.145Z',
        'compound': 'Fear',
        'classification': -0.94
    },
    {
        '_id': '5fc4f80efed14649e9fa1bda',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:47:24.048Z',
        'compound': 'Fear',
        'classification': -0.86
    },
    {
        '_id': '5fc4f80efed14649e9fa1bdb',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:47:57.438Z',
        'compound': 'Sadness',
        'classification': -0.8
    },
    {
        '_id': '5fc4f80efed14649e9fa1bdc',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:47:58.230Z',
        'compound': 'Sadness',
        'classification': -0.83
    },
    {
        '_id': '5fc4f833fed14649e9fa1bdd',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:16.293Z',
        'compound': 'Dispair',
        'classification': -0.78
    },
    {
        '_id': '5fc4f833fed14649e9fa1bde',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:17.737Z',
        'compound': 'Sentimentality',
        'classification': -0.47
    },
    {
        '_id': '5fc4f833fed14649e9fa1bdf',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:18.770Z',
        'compound': 'Sentimentality',
        'classification': -0.26
    },
    {
        '_id': '5fc4f833fed14649e9fa1be0',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:19.680Z',
        'compound': 'Sentimentality',
        'classification': -0.34
    },
    {
        '_id': '5fc4f833fed14649e9fa1be1',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:20.775Z',
        'compound': 'Fear',
        'classification': -0.68
    },
    {
        '_id': '5fc4f833fed14649e9fa1be2',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:21.481Z',
        'compound': 'Sadness',
        'classification': -0.87
    },
    {
        '_id': '5fc4f833fed14649e9fa1be3',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:22.550Z',
        'compound': 'Fear',
        'classification': -0.65
    },
    {
        '_id': '5fc4f833fed14649e9fa1be4',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:22.552Z',
        'compound': 'Fear',
        'classification': -0.75
    },
    {
        '_id': '5fc4f833fed14649e9fa1be5',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:22.976Z',
        'compound': 'Anger',
        'classification': -0.74
    },
    {
        '_id': '5fc4f833fed14649e9fa1be6',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:24.006Z',
        'compound': 'Envy',
        'classification': -0.7
    },
    {
        '_id': '5fc4f833fed14649e9fa1be7',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:24.008Z',
        'compound': 'Envy',
        'classification': -0.7
    },
    {
        '_id': '5fc4f833fed14649e9fa1be8',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:24.810Z',
        'compound': 'Anger',
        'classification': -0.78
    },
    {
        '_id': '5fc4f833fed14649e9fa1be9',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:24.812Z',
        'compound': 'Anger',
        'classification': -0.87
    },
    {
        '_id': '5fc4f833fed14649e9fa1bea',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:25.702Z',
        'compound': 'Envy',
        'classification': -0.86
    },
    {
        '_id': '5fc4f833fed14649e9fa1beb',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:25.704Z',
        'compound': 'Anger',
        'classification': -0.72
    },
    {
        '_id': '5fc4f833fed14649e9fa1bec',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:26.730Z',
        'compound': 'Anger',
        'classification': -0.79
    },
    {
        '_id': '5fc4f833fed14649e9fa1bed',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:27.332Z',
        'compound': 'Envy',
        'classification': -0.94
    },
    {
        '_id': '5fc4f833fed14649e9fa1bee',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:32.805Z',
        'compound': 'Sadness',
        'classification': -0.98
    },
    {
        '_id': '5fc4f833fed14649e9fa1bef',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:34.317Z',
        'compound': 'Sadness',
        'classification': -0.98
    },
    {
        '_id': '5fc4f833fed14649e9fa1bf0',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:35.039Z',
        'compound': 'Sadness',
        'classification': -0.78
    },
    {
        '_id': '5fc4f849fed14649e9fa1bf1',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:35.727Z',
        'compound': 'Sadness',
        'classification': -0.97
    },
    {
        '_id': '5fc4f849fed14649e9fa1bf2',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:36.729Z',
        'compound': 'Envy',
        'classification': -0.96
    },
    {
        '_id': '5fc4f849fed14649e9fa1bf3',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:37.814Z',
        'compound': 'Envy',
        'classification': -0.94
    },
    {
        '_id': '5fc4f849fed14649e9fa1bf4',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:38.722Z',
        'compound': 'Sadness',
        'classification': -0.95
    },
    {
        '_id': '5fc4f849fed14649e9fa1bf5',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:39.774Z',
        'compound': 'Remorse',
        'classification': -0.82
    },
    {
        '_id': '5fc4f849fed14649e9fa1bf6',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:40.758Z',
        'compound': 'Sentimentality',
        'classification': -0.66
    },
    {
        '_id': '5fc4f849fed14649e9fa1bf7',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:41.262Z',
        'compound': 'Sadness',
        'classification': -0.91
    },
    {
        '_id': '5fc4f849fed14649e9fa1bf8',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:42.703Z',
        'compound': 'Sadness',
        'classification': -0.68
    },
    {
        '_id': '5fc4f849fed14649e9fa1bf9',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:43.755Z',
        'compound': 'Envy',
        'classification': -0.69
    },
    {
        '_id': '5fc4f849fed14649e9fa1bfa',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:44.446Z',
        'compound': 'Sadness',
        'classification': -1
    },
    {
        '_id': '5fc4f849fed14649e9fa1bfb',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:46.412Z',
        'compound': 'Sadness',
        'classification': -0.43
    },
    {
        '_id': '5fc4f849fed14649e9fa1bfc',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:47.330Z',
        'compound': 'Sadness',
        'classification': -0.99
    },
    {
        '_id': '5fc4f849fed14649e9fa1bfd',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:48.105Z',
        'compound': 'Sadness',
        'classification': -0.99
    },
    {
        '_id': '5fc4f849fed14649e9fa1bfe',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:49.257Z',
        'compound': 'Sentimentality',
        'classification': -0.5
    },
    {
        '_id': '5fc4f849fed14649e9fa1bff',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:50.461Z',
        'compound': 'Sadness',
        'classification': -0.75
    },
    {
        '_id': '5fc4f849fed14649e9fa1c00',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:51.632Z',
        'compound': 'Sadness',
        'classification': -0.88
    },
    {
        '_id': '5fc4f849fed14649e9fa1c01',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:51.634Z',
        'compound': 'Sadness',
        'classification': -0.86
    },
    {
        '_id': '5fc4f849fed14649e9fa1c02',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:52.772Z',
        'compound': 'Sadness',
        'classification': -0.97
    },
    {
        '_id': '5fc4f849fed14649e9fa1c03',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:53.734Z',
        'compound': 'Sadness',
        'classification': -0.89
    },
    {
        '_id': '5fc4f849fed14649e9fa1c04',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:57.574Z',
        'compound': 'Sadness',
        'classification': -0.89
    },
    {
        '_id': '5fc4f860fed14649e9fa1c05',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:48:58.653Z',
        'compound': 'Sadness',
        'classification': -0.94
    },
    {
        '_id': '5fc4f860fed14649e9fa1c06',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:04.864Z',
        'compound': 'Sadness',
        'classification': -0.97
    },
    {
        '_id': '5fc4f860fed14649e9fa1c07',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:04.866Z',
        'compound': 'Sadness',
        'classification': -0.96
    },
    {
        '_id': '5fc4f860fed14649e9fa1c08',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:05.900Z',
        'compound': 'Sadness',
        'classification': -0.99
    },
    {
        '_id': '5fc4f860fed14649e9fa1c09',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:06.992Z',
        'compound': 'Sadness',
        'classification': -1
    },
    {
        '_id': '5fc4f860fed14649e9fa1c0a',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:07.691Z',
        'compound': 'Fear',
        'classification': -0.88
    },
    {
        '_id': '5fc4f860fed14649e9fa1c0b',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:08.787Z',
        'compound': 'Sadness',
        'classification': -0.69
    },
    {
        '_id': '5fc4f860fed14649e9fa1c0c',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:09.508Z',
        'compound': 'Envy',
        'classification': -0.98
    },
    {
        '_id': '5fc4f860fed14649e9fa1c0d',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:10.235Z',
        'compound': 'Envy',
        'classification': -0.97
    },
    {
        '_id': '5fc4f860fed14649e9fa1c0e',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:11.323Z',
        'compound': 'Anger',
        'classification': -0.86
    },
    {
        '_id': '5fc4f860fed14649e9fa1c0f',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:12.414Z',
        'compound': 'Envy',
        'classification': -0.95
    },
    {
        '_id': '5fc4f860fed14649e9fa1c10',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:13.109Z',
        'compound': 'Sadness',
        'classification': -0.84
    },
    {
        '_id': '5fc4f860fed14649e9fa1c11',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:14.129Z',
        'compound': 'Despair',
        'classification': -0.89
    },
    {
        '_id': '5fc4f860fed14649e9fa1c12',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:14.892Z',
        'compound': 'Despair',
        'classification': -0.84
    },
    {
        '_id': '5fc4f860fed14649e9fa1c13',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:15.607Z',
        'compound': 'Despair',
        'classification': -0.89
    },
    {
        '_id': '5fc4f860fed14649e9fa1c14',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:16.749Z',
        'compound': 'Despair',
        'classification': -0.79
    },
    {
        '_id': '5fc4f860fed14649e9fa1c15',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:17.791Z',
        'compound': 'Despair',
        'classification': -0.84
    },
    {
        '_id': '5fc4f860fed14649e9fa1c16',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:18.810Z',
        'compound': 'Despair',
        'classification': -0.86
    },
    {
        '_id': '5fc4f860fed14649e9fa1c17',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:19.798Z',
        'compound': 'Despair',
        'classification': -0.86
    },
    {
        '_id': '5fc4f860fed14649e9fa1c18',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:20.773Z',
        'compound': 'Despair',
        'classification': -0.88
    },
    {
        '_id': '5fc4f881fed14649e9fa1c19',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:21.834Z',
        'compound': 'Despair',
        'classification': -0.88
    },
    {
        '_id': '5fc4f881fed14649e9fa1c1a',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:22.487Z',
        'compound': 'Despair',
        'classification': -0.84
    },
    {
        '_id': '5fc4f881fed14649e9fa1c1b',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:23.636Z',
        'compound': 'Despair',
        'classification': -0.87
    },
    {
        '_id': '5fc4f881fed14649e9fa1c1c',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:24.307Z',
        'compound': 'Sadness',
        'classification': -0.97
    },
    {
        '_id': '5fc4f881fed14649e9fa1c1d',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:25.227Z',
        'compound': 'Sadness',
        'classification': -0.93
    },
    {
        '_id': '5fc4f881fed14649e9fa1c1e',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:27.081Z',
        'compound': 'Sadness',
        'classification': -0.9
    },
    {
        '_id': '5fc4f881fed14649e9fa1c1f',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:28.101Z',
        'compound': 'Sadness',
        'classification': -0.91
    },
    {
        '_id': '5fc4f881fed14649e9fa1c20',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:28.737Z',
        'compound': 'Sadness',
        'classification': -0.91
    },
    {
        '_id': '5fc4f881fed14649e9fa1c21',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:29.775Z',
        'compound': 'Sadness',
        'classification': -0.97
    },
    {
        '_id': '5fc4f881fed14649e9fa1c22',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:30.419Z',
        'compound': 'Sadness',
        'classification': -0.9
    },
    {
        '_id': '5fc4f881fed14649e9fa1c23',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:31.397Z',
        'compound': 'Dispair',
        'classification': -0.93
    },
    {
        '_id': '5fc4f881fed14649e9fa1c24',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:32.405Z',
        'compound': 'Sadness',
        'classification': -0.72
    },
    {
        '_id': '5fc4f881fed14649e9fa1c25',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:33.089Z',
        'compound': 'Sadness',
        'classification': -0.81
    },
    {
        '_id': '5fc4f881fed14649e9fa1c26',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:34.001Z',
        'compound': 'Sadness',
        'classification': -0.7
    },
    {
        '_id': '5fc4f881fed14649e9fa1c27',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:35.492Z',
        'compound': 'Despair',
        'classification': -0.76
    },
    {
        '_id': '5fc4f881fed14649e9fa1c28',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:36.170Z',
        'compound': 'Envy',
        'classification': -0.68
    },
    {
        '_id': '5fc4f881fed14649e9fa1c29',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:36.936Z',
        'compound': 'Sadness',
        'classification': -0.82
    },
    {
        '_id': '5fc4f881fed14649e9fa1c2a',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:37.536Z',
        'compound': 'Fear',
        'classification': -0.82
    },
    {
        '_id': '5fc4f881fed14649e9fa1c2b',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:49:48.588Z',
        'compound': 'Happiness',
        'classification': 0.89
    },
    {
        '_id': '5fc4f881fed14649e9fa1c2c',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:53.250Z',
        'compound': 'Dominance',
        'classification': -0.39
    },
    {
        '_id': '5fc4f8a3fed14649e9fa1c2d',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:49:54.599Z',
        'compound': 'Sadness',
        'classification': -0.21
    },
    {
        '_id': '5fc4f8a3fed14649e9fa1c2e',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:01.832Z',
        'compound': 'Sentimentality',
        'classification': -0.19
    },
    {
        '_id': '5fc4f8a3fed14649e9fa1c2f',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:02.756Z',
        'compound': 'Envy',
        'classification': -0.55
    },
    {
        '_id': '5fc4f8a3fed14649e9fa1c30',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:03.715Z',
        'compound': 'Sadness',
        'classification': -0.79
    },
    {
        '_id': '5fc4f8a3fed14649e9fa1c31',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:04.776Z',
        'compound': 'Sadness',
        'classification': -0.82
    },
    {
        '_id': '5fc4f8a3fed14649e9fa1c32',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:05.400Z',
        'compound': 'Dispair',
        'classification': -0.91
    },
    {
        '_id': '5fc4f8a3fed14649e9fa1c33',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:10.724Z',
        'compound': 'Sadness',
        'classification': -1
    },
    {
        '_id': '5fc4f8a3fed14649e9fa1c34',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:12.441Z',
        'compound': 'Fear',
        'classification': -0.97
    },
    {
        '_id': '5fc4f8a3fed14649e9fa1c35',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:15.065Z',
        'compound': 'Dispair',
        'classification': -0.74
    },
    {
        '_id': '5fc4f8a3fed14649e9fa1c36',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:16.065Z',
        'compound': 'Fear',
        'classification': -0.69
    },
    {
        '_id': '5fc4f8a3fed14649e9fa1c37',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:17.975Z',
        'compound': 'Guilt',
        'classification': -0.08
    },
    {
        '_id': '5fc4f8a3fed14649e9fa1c38',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:18.981Z',
        'compound': 'Sadness',
        'classification': -0.98
    },
    {
        '_id': '5fc4f8a3fed14649e9fa1c39',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:19.983Z',
        'compound': 'Sadness',
        'classification': -0.85
    },
    {
        '_id': '5fc4f8a3fed14649e9fa1c3a',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:20.843Z',
        'compound': 'Guilt',
        'classification': -0.25
    },
    {
        '_id': '5fc4f8a3fed14649e9fa1c3b',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:21.812Z',
        'compound': 'Sadness',
        'classification': -0.87
    },
    {
        '_id': '5fc4f8a3fed14649e9fa1c3c',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:22.874Z',
        'compound': 'Sadness',
        'classification': -0.79
    },
    {
        '_id': '5fc4f8a3fed14649e9fa1c3d',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:50:23.231Z',
        'compound': 'Sadness',
        'classification': -0.96
    },
    {
        '_id': '5fc4f8a3fed14649e9fa1c3e',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:25.558Z',
        'compound': 'Fear',
        'classification': -0.75
    },
    {
        '_id': '5fc4f8a3fed14649e9fa1c3f',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:26.418Z',
        'compound': 'Envy',
        'classification': -0.85
    },
    {
        '_id': '5fc4f8a3fed14649e9fa1c40',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:27.662Z',
        'compound': 'Sadness',
        'classification': -0.98
    },
    {
        '_id': '5fc4f8c1fed14649e9fa1c41',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:35.855Z',
        'compound': 'Sadness',
        'classification': -1
    },
    {
        '_id': '5fc4f8c1fed14649e9fa1c42',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:41.323Z',
        'compound': 'Sadness',
        'classification': -1
    },
    {
        '_id': '5fc4f8c1fed14649e9fa1c43',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:42.723Z',
        'compound': 'Sadness',
        'classification': -0.99
    },
    {
        '_id': '5fc4f8c1fed14649e9fa1c44',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:43.086Z',
        'compound': 'Sadness',
        'classification': -0.71
    },
    {
        '_id': '5fc4f8c1fed14649e9fa1c45',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:44.642Z',
        'compound': 'Sadness',
        'classification': -0.9
    },
    {
        '_id': '5fc4f8c1fed14649e9fa1c46',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:45.323Z',
        'compound': 'Sadness',
        'classification': -0.81
    },
    {
        '_id': '5fc4f8c1fed14649e9fa1c47',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:46.447Z',
        'compound': 'Sentimentality',
        'classification': -0.34
    },
    {
        '_id': '5fc4f8c1fed14649e9fa1c48',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:47.189Z',
        'compound': 'Sentimentality',
        'classification': -0.48
    },
    {
        '_id': '5fc4f8c1fed14649e9fa1c49',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:48.321Z',
        'compound': 'Dispair',
        'classification': -0.86
    },
    {
        '_id': '5fc4f8c1fed14649e9fa1c4a',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:49.330Z',
        'compound': 'Sentimentality',
        'classification': -0.48
    },
    {
        '_id': '5fc4f8c1fed14649e9fa1c4b',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:50.175Z',
        'compound': 'Sentimentality',
        'classification': -0.59
    },
    {
        '_id': '5fc4f8c1fed14649e9fa1c4c',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:51.328Z',
        'compound': 'Sentimentality',
        'classification': -0.47
    },
    {
        '_id': '5fc4f8c1fed14649e9fa1c4d',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:52.384Z',
        'compound': 'Despair',
        'classification': -0.87
    },
    {
        '_id': '5fc4f8c1fed14649e9fa1c4e',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:50:52.746Z',
        'compound': 'Sadness',
        'classification': -0.81
    },
    {
        '_id': '5fc4f8c1fed14649e9fa1c4f',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:53.692Z',
        'compound': 'Dispair',
        'classification': -0.94
    },
    {
        '_id': '5fc4f8c1fed14649e9fa1c50',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:54.418Z',
        'compound': 'Despair',
        'classification': -0.56
    },
    {
        '_id': '5fc4f8c1fed14649e9fa1c51',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:55.219Z',
        'compound': 'Envy',
        'classification': -0.77
    },
    {
        '_id': '5fc4f8c1fed14649e9fa1c52',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:56.172Z',
        'compound': 'Remorse',
        'classification': -0.6
    },
    {
        '_id': '5fc4f8c1fed14649e9fa1c53',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:56.840Z',
        'compound': 'Dispair',
        'classification': -0.67
    },
    {
        '_id': '5fc4f8c1fed14649e9fa1c54',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:50:57.157Z',
        'compound': 'Sadness',
        'classification': -0.87
    },
    {
        '_id': '5fc4f8d1fed14649e9fa1c55',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:57.807Z',
        'compound': 'Sentimentality',
        'classification': -0.33
    },
    {
        '_id': '5fc4f8d1fed14649e9fa1c56',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:50:59.820Z',
        'compound': 'Envy',
        'classification': -0.61
    },
    {
        '_id': '5fc4f8d1fed14649e9fa1c57',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:00.772Z',
        'compound': 'Despair',
        'classification': -0.75
    },
    {
        '_id': '5fc4f8d1fed14649e9fa1c58',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:01.764Z',
        'compound': 'Despair',
        'classification': -0.65
    },
    {
        '_id': '5fc4f8d1fed14649e9fa1c59',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:02.713Z',
        'compound': 'Envy',
        'classification': -0.61
    },
    {
        '_id': '5fc4f8d1fed14649e9fa1c5a',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:03.553Z',
        'compound': 'Despair',
        'classification': -0.55
    },
    {
        '_id': '5fc4f8d1fed14649e9fa1c5b',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:04.208Z',
        'compound': 'Contempt',
        'classification': -0.76
    },
    {
        '_id': '5fc4f8d1fed14649e9fa1c5c',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:04.881Z',
        'compound': 'Dispair',
        'classification': -0.8
    },
    {
        '_id': '5fc4f8d1fed14649e9fa1c5d',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:05.249Z',
        'compound': 'Anger',
        'classification': -0.78
    },
    {
        '_id': '5fc4f8d1fed14649e9fa1c5e',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:05.764Z',
        'compound': 'Dispair',
        'classification': -0.75
    },
    {
        '_id': '5fc4f8d1fed14649e9fa1c5f',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:06.137Z',
        'compound': 'Anger',
        'classification': -0.69
    },
    {
        '_id': '5fc4f8d1fed14649e9fa1c60',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:07.946Z',
        'compound': 'Envy',
        'classification': -0.85
    },
    {
        '_id': '5fc4f8d1fed14649e9fa1c61',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:08.335Z',
        'compound': 'Envy',
        'classification': -0.71
    },
    {
        '_id': '5fc4f8d1fed14649e9fa1c62',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:08.836Z',
        'compound': 'Envy',
        'classification': -0.81
    },
    {
        '_id': '5fc4f8d1fed14649e9fa1c63',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:09.445Z',
        'compound': 'Sentimentality',
        'classification': -0.56
    },
    {
        '_id': '5fc4f8d1fed14649e9fa1c64',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:10.551Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f8d1fed14649e9fa1c65',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:11.443Z',
        'compound': 'Sadness',
        'classification': -0.78
    },
    {
        '_id': '5fc4f8d1fed14649e9fa1c66',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:12.207Z',
        'compound': 'Sadness',
        'classification': -0.74
    },
    {
        '_id': '5fc4f8d1fed14649e9fa1c67',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:12.987Z',
        'compound': 'Sadness',
        'classification': -0.89
    },
    {
        '_id': '5fc4f8d1fed14649e9fa1c68',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:13.895Z',
        'compound': 'Sadness',
        'classification': -0.83
    },
    {
        '_id': '5fc4f8e1fed14649e9fa1c69',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:15.487Z',
        'compound': 'Sadness',
        'classification': -0.72
    },
    {
        '_id': '5fc4f8e1fed14649e9fa1c6a',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:16.549Z',
        'compound': 'Sadness',
        'classification': -0.8
    },
    {
        '_id': '5fc4f8e1fed14649e9fa1c6b',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:17.228Z',
        'compound': 'Sadness',
        'classification': -0.91
    },
    {
        '_id': '5fc4f8e1fed14649e9fa1c6c',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:18.155Z',
        'compound': 'Sadness',
        'classification': -0.77
    },
    {
        '_id': '5fc4f8e1fed14649e9fa1c6d',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:19.107Z',
        'compound': 'Envy',
        'classification': -0.89
    },
    {
        '_id': '5fc4f8e1fed14649e9fa1c6e',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:19.975Z',
        'compound': 'Sadness',
        'classification': -0.72
    },
    {
        '_id': '5fc4f8e1fed14649e9fa1c6f',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:20.847Z',
        'compound': 'Sadness',
        'classification': -0.79
    },
    {
        '_id': '5fc4f8e1fed14649e9fa1c70',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:21.518Z',
        'compound': 'Sadness',
        'classification': -0.71
    },
    {
        '_id': '5fc4f8e1fed14649e9fa1c71',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:22.644Z',
        'compound': 'Sadness',
        'classification': -0.74
    },
    {
        '_id': '5fc4f8e1fed14649e9fa1c72',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:23.266Z',
        'compound': 'Sadness',
        'classification': -0.89
    },
    {
        '_id': '5fc4f8e1fed14649e9fa1c73',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:24.084Z',
        'compound': 'Sadness',
        'classification': -0.73
    },
    {
        '_id': '5fc4f8e1fed14649e9fa1c74',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:24.418Z',
        'compound': 'Submission',
        'classification': -0.27
    },
    {
        '_id': '5fc4f8e1fed14649e9fa1c75',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:24.812Z',
        'compound': 'Sadness',
        'classification': -0.72
    },
    {
        '_id': '5fc4f8e1fed14649e9fa1c76',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:25.834Z',
        'compound': 'Sentimentality',
        'classification': -0.34
    },
    {
        '_id': '5fc4f8e1fed14649e9fa1c77',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:26.512Z',
        'compound': 'Remorse',
        'classification': -0.75
    },
    {
        '_id': '5fc4f8e1fed14649e9fa1c78',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:27.137Z',
        'compound': 'Envy',
        'classification': -0.78
    },
    {
        '_id': '5fc4f8e1fed14649e9fa1c79',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:27.798Z',
        'compound': 'Dispair',
        'classification': -0.61
    },
    {
        '_id': '5fc4f8e1fed14649e9fa1c7a',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:28.803Z',
        'compound': 'Dispair',
        'classification': -0.85
    },
    {
        '_id': '5fc4f8e1fed14649e9fa1c7b',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:29.135Z',
        'compound': 'Sadness',
        'classification': -0.81
    },
    {
        '_id': '5fc4f8e1fed14649e9fa1c7c',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:29.720Z',
        'compound': 'Sentimentality',
        'classification': -0.52
    },
    {
        '_id': '5fc4f8effed14649e9fa1c7d',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:30.125Z',
        'compound': 'Sadness',
        'classification': -0.79
    },
    {
        '_id': '5fc4f8effed14649e9fa1c7e',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:30.732Z',
        'compound': 'Dispair',
        'classification': -0.71
    },
    {
        '_id': '5fc4f8effed14649e9fa1c7f',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:31.389Z',
        'compound': 'Dispair',
        'classification': -0.77
    },
    {
        '_id': '5fc4f8effed14649e9fa1c80',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:32.048Z',
        'compound': 'Sadness',
        'classification': -0.93
    },
    {
        '_id': '5fc4f8effed14649e9fa1c81',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:32.597Z',
        'compound': 'Sadness',
        'classification': -0.77
    },
    {
        '_id': '5fc4f8effed14649e9fa1c82',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:33.314Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f8effed14649e9fa1c83',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:33.910Z',
        'compound': 'Sadness',
        'classification': -0.95
    },
    {
        '_id': '5fc4f8effed14649e9fa1c84',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:34.635Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f8effed14649e9fa1c85',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:34.637Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f8effed14649e9fa1c86',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:35.228Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f8effed14649e9fa1c87',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:36.066Z',
        'compound': 'Love',
        'classification': 0.35
    },
    {
        '_id': '5fc4f8effed14649e9fa1c88',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:36.582Z',
        'compound': 'Dispair',
        'classification': -0.91
    },
    {
        '_id': '5fc4f8effed14649e9fa1c89',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:37.150Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f8effed14649e9fa1c8a',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:37.598Z',
        'compound': 'Dominance',
        'classification': -0.45
    },
    {
        '_id': '5fc4f8effed14649e9fa1c8b',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:38.683Z',
        'compound': 'Despair',
        'classification': -0.83
    },
    {
        '_id': '5fc4f8effed14649e9fa1c8c',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:39.217Z',
        'compound': 'Fear',
        'classification': -0.8
    },
    {
        '_id': '5fc4f8effed14649e9fa1c8d',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:40.391Z',
        'compound': 'Despair',
        'classification': -0.93
    },
    {
        '_id': '5fc4f8effed14649e9fa1c8e',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:41.360Z',
        'compound': 'Despair',
        'classification': -0.83
    },
    {
        '_id': '5fc4f8effed14649e9fa1c8f',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:42.389Z',
        'compound': 'Despair',
        'classification': -0.67
    },
    {
        '_id': '5fc4f8effed14649e9fa1c90',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:43.353Z',
        'compound': 'Sentimentality',
        'classification': -0.43
    },
    {
        '_id': '5fc4f8fefed14649e9fa1c91',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:44.373Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f8fefed14649e9fa1c92',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:45.472Z',
        'compound': 'Sentimentality',
        'classification': -0.23
    },
    {
        '_id': '5fc4f8fefed14649e9fa1c93',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:46.511Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f8fefed14649e9fa1c94',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:47.408Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f8fefed14649e9fa1c95',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:48.282Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f8fefed14649e9fa1c96',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:49.194Z',
        'compound': 'Love',
        'classification': 0.46
    },
    {
        '_id': '5fc4f8fefed14649e9fa1c97',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:50.011Z',
        'compound': 'Submission',
        'classification': -0.41
    },
    {
        '_id': '5fc4f8fefed14649e9fa1c98',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:50.940Z',
        'compound': 'Sentimentality',
        'classification': -0.39
    },
    {
        '_id': '5fc4f8fefed14649e9fa1c99',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:51.894Z',
        'compound': 'Despair',
        'classification': -0.84
    },
    {
        '_id': '5fc4f8fefed14649e9fa1c9a',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:52.267Z',
        'compound': 'Sentimentality',
        'classification': -0.24
    },
    {
        '_id': '5fc4f8fefed14649e9fa1c9b',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:52.840Z',
        'compound': 'Sentimentality',
        'classification': -0.2
    },
    {
        '_id': '5fc4f8fefed14649e9fa1c9c',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:53.795Z',
        'compound': 'Remorse',
        'classification': -0.81
    },
    {
        '_id': '5fc4f8fefed14649e9fa1c9d',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:54.270Z',
        'compound': 'Envy',
        'classification': -0.79
    },
    {
        '_id': '5fc4f8fefed14649e9fa1c9e',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:54.895Z',
        'compound': 'Remorse',
        'classification': -0.81
    },
    {
        '_id': '5fc4f8fefed14649e9fa1c9f',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:51:55.248Z',
        'compound': 'Envy',
        'classification': -0.85
    },
    {
        '_id': '5fc4f8fefed14649e9fa1ca0',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:55.972Z',
        'compound': 'Remorse',
        'classification': -0.76
    },
    {
        '_id': '5fc4f8fefed14649e9fa1ca1',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:55.974Z',
        'compound': 'Remorse',
        'classification': -0.72
    },
    {
        '_id': '5fc4f8fefed14649e9fa1ca2',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:56.661Z',
        'compound': 'Contempt',
        'classification': -0.72
    },
    {
        '_id': '5fc4f8fefed14649e9fa1ca3',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:57.516Z',
        'compound': 'Remorse',
        'classification': -0.77
    },
    {
        '_id': '5fc4f8fefed14649e9fa1ca4',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:58.498Z',
        'compound': 'Contempt',
        'classification': -0.74
    },
    {
        '_id': '5fc4f90cfed14649e9fa1ca5',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:51:59.392Z',
        'compound': 'Envy',
        'classification': -0.68
    },
    {
        '_id': '5fc4f90cfed14649e9fa1ca6',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:00.231Z',
        'compound': 'Dispair',
        'classification': -0.65
    },
    {
        '_id': '5fc4f90cfed14649e9fa1ca7',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:00.909Z',
        'compound': 'Submission',
        'classification': -0.16
    },
    {
        '_id': '5fc4f90cfed14649e9fa1ca8',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:01.839Z',
        'compound': 'Fear',
        'classification': -0.73
    },
    {
        '_id': '5fc4f90cfed14649e9fa1ca9',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:01.841Z',
        'compound': 'Fear',
        'classification': -0.87
    },
    {
        '_id': '5fc4f90cfed14649e9fa1caa',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:02.805Z',
        'compound': 'Envy',
        'classification': -0.54
    },
    {
        '_id': '5fc4f90cfed14649e9fa1cab',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:03.904Z',
        'compound': 'Sentimentality',
        'classification': -0.2
    },
    {
        '_id': '5fc4f90cfed14649e9fa1cac',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:52:04.221Z',
        'compound': 'Envy',
        'classification': -0.95
    },
    {
        '_id': '5fc4f90cfed14649e9fa1cad',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:05.325Z',
        'compound': 'Submission',
        'classification': -0.47
    },
    {
        '_id': '5fc4f90cfed14649e9fa1cae',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:05.997Z',
        'compound': 'Despair',
        'classification': -0.68
    },
    {
        '_id': '5fc4f90cfed14649e9fa1caf',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:52:06.447Z',
        'compound': 'Dominance',
        'classification': -0.49
    },
    {
        '_id': '5fc4f90cfed14649e9fa1cb0',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:07.077Z',
        'compound': 'Contempt',
        'classification': -0.77
    },
    {
        '_id': '5fc4f90cfed14649e9fa1cb1',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:52:07.396Z',
        'compound': 'Envy',
        'classification': -0.88
    },
    {
        '_id': '5fc4f90cfed14649e9fa1cb2',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:07.989Z',
        'compound': 'Disgust',
        'classification': -0.69
    },
    {
        '_id': '5fc4f90cfed14649e9fa1cb3',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:09.126Z',
        'compound': 'Disgust',
        'classification': -0.78
    },
    {
        '_id': '5fc4f90cfed14649e9fa1cb4',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:10.034Z',
        'compound': 'Sadness',
        'classification': -0.75
    },
    {
        '_id': '5fc4f90cfed14649e9fa1cb5',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:10.938Z',
        'compound': 'Despair',
        'classification': -0.64
    },
    {
        '_id': '5fc4f90cfed14649e9fa1cb6',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:52:11.436Z',
        'compound': 'Envy',
        'classification': -0.74
    },
    {
        '_id': '5fc4f90cfed14649e9fa1cb7',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:12.045Z',
        'compound': 'Dispair',
        'classification': -0.61
    },
    {
        '_id': '5fc4f90cfed14649e9fa1cb8',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:52:12.658Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f91afed14649e9fa1cb9',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:13.288Z',
        'compound': 'Submission',
        'classification': -0.27
    },
    {
        '_id': '5fc4f91afed14649e9fa1cba',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:52:13.777Z',
        'compound': 'Submission',
        'classification': -0.22
    },
    {
        '_id': '5fc4f91afed14649e9fa1cbb',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:14.374Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f91afed14649e9fa1cbc',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:52:14.726Z',
        'compound': 'Sentimentality',
        'classification': -0.44
    },
    {
        '_id': '5fc4f91afed14649e9fa1cbd',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:15.378Z',
        'compound': 'Dispair',
        'classification': -0.72
    },
    {
        '_id': '5fc4f91afed14649e9fa1cbe',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:52:15.712Z',
        'compound': 'Dominance',
        'classification': -0.66
    },
    {
        '_id': '5fc4f91afed14649e9fa1cbf',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:16.301Z',
        'compound': 'Dispair',
        'classification': -0.89
    },
    {
        '_id': '5fc4f91afed14649e9fa1cc0',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:52:16.654Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f91afed14649e9fa1cc1',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:17.257Z',
        'compound': 'Dispair',
        'classification': -0.85
    },
    {
        '_id': '5fc4f91afed14649e9fa1cc2',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:17.922Z',
        'compound': 'Dispair',
        'classification': -0.88
    },
    {
        '_id': '5fc4f91afed14649e9fa1cc3',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:18.929Z',
        'compound': 'Envy',
        'classification': -0.68
    },
    {
        '_id': '5fc4f91afed14649e9fa1cc4',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:52:19.291Z',
        'compound': 'Sadness',
        'classification': -0.87
    },
    {
        '_id': '5fc4f91afed14649e9fa1cc5',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:19.912Z',
        'compound': 'Sentimentality',
        'classification': -0.38
    },
    {
        '_id': '5fc4f91afed14649e9fa1cc6',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:20.953Z',
        'compound': 'Fear',
        'classification': -0.69
    },
    {
        '_id': '5fc4f91afed14649e9fa1cc7',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:21.717Z',
        'compound': 'Dispair',
        'classification': -0.61
    },
    {
        '_id': '5fc4f91afed14649e9fa1cc8',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:22.339Z',
        'compound': 'Dispair',
        'classification': -0.72
    },
    {
        '_id': '5fc4f91afed14649e9fa1cc9',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:23.250Z',
        'compound': 'Sadness',
        'classification': -0.73
    },
    {
        '_id': '5fc4f91afed14649e9fa1cca',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:24.246Z',
        'compound': 'Dispair',
        'classification': -0.85
    },
    {
        '_id': '5fc4f91afed14649e9fa1ccb',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:25.147Z',
        'compound': 'Sentimentality',
        'classification': -0.43
    },
    {
        '_id': '5fc4f91afed14649e9fa1ccc',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:26.071Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f92cfed14649e9fa1ccd',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:27.021Z',
        'compound': 'Dispair',
        'classification': -0.83
    },
    {
        '_id': '5fc4f92cfed14649e9fa1cce',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:28.118Z',
        'compound': 'Dispair',
        'classification': -0.8
    },
    {
        '_id': '5fc4f92cfed14649e9fa1ccf',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:29.045Z',
        'compound': 'Dispair',
        'classification': -0.7
    },
    {
        '_id': '5fc4f92cfed14649e9fa1cd0',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:29.899Z',
        'compound': 'Remorse',
        'classification': -0.72
    },
    {
        '_id': '5fc4f92cfed14649e9fa1cd1',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:30.711Z',
        'compound': 'Remorse',
        'classification': -0.7
    },
    {
        '_id': '5fc4f92cfed14649e9fa1cd2',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:31.556Z',
        'compound': 'Dispair',
        'classification': -0.77
    },
    {
        '_id': '5fc4f92cfed14649e9fa1cd3',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:32.738Z',
        'compound': 'Sentimentality',
        'classification': -0.23
    },
    {
        '_id': '5fc4f92cfed14649e9fa1cd4',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:33.726Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f92cfed14649e9fa1cd5',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:34.661Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f92cfed14649e9fa1cd6',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:35.585Z',
        'compound': 'Neutral',
        'classification': 0
    },
    {
        '_id': '5fc4f92cfed14649e9fa1cd7',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:37.284Z',
        'compound': 'Envy',
        'classification': -0.8
    },
    {
        '_id': '5fc4f92cfed14649e9fa1cd8',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:38.144Z',
        'compound': 'Envy',
        'classification': -0.72
    },
    {
        '_id': '5fc4f92cfed14649e9fa1cd9',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:39.233Z',
        'compound': 'Fear',
        'classification': -0.66
    },
    {
        '_id': '5fc4f92cfed14649e9fa1cda',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:40.167Z',
        'compound': 'Despair',
        'classification': -0.89
    },
    {
        '_id': '5fc4f92cfed14649e9fa1cdb',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:41.101Z',
        'compound': 'Despair',
        'classification': -0.87
    },
    {
        '_id': '5fc4f92cfed14649e9fa1cdc',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:41.697Z',
        'compound': 'Submission',
        'classification': -0.45
    },
    {
        '_id': '5fc4f92cfed14649e9fa1cdd',
        'participant_id': '5fc4f2908da4e690a78fac26',
        'timestamp': '2020-11-30T13:52:42.042Z',
        'compound': 'Sadness',
        'classification': -0.88
    },
    {
        '_id': '5fc4f92cfed14649e9fa1cde',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:42.625Z',
        'compound': 'Dispair',
        'classification': -0.84
    },
    {
        '_id': '5fc4f92cfed14649e9fa1cdf',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:43.706Z',
        'compound': 'Dispair',
        'classification': -0.68
    },
    {
        '_id': '5fc4f92cfed14649e9fa1ce0',
        'participant_id': '5fbfb9114786572f6e641ad5',
        'timestamp': '2020-11-30T13:52:44.576Z',
        'compound': 'Dispair',
        'classification': -0.73
    }
];

// eslint-disable-next-line no-unused-vars
export const mockFetchEmotions = meetingId => Promise.resolve(mockEmotionsData);

export const mockFetchUserNames = arrUids => Promise.resolve(arrUids.map((id, i) => {
    return { _id: id,
        name: `Name${i} Nameovich${i}` };
}));
