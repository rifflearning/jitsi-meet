import { Link, Typography } from '@material-ui/core';
import React from 'react';

const styles = {
    container: { display: 'flex' },
    marginRight: { marginRight: '20px' }
};

export default () => (<div style = { styles.container }>
    <Typography
        style = { styles.marginRight }
        variant = 'body2'>
        Copyright ©{' '}
        <Link
            color = 'inherit'
            href = 'https://riffanalytics.ai'
            target = '_blank'>
            Riff Analytics
        </Link>
        {` ${new Date().getFullYear()}.`}
    </Typography>
    <Typography
        style = { styles.marginRight }
        variant = 'body2'>
        <Link
            color = 'inherit'
            href= 'https://riffanalytics.ai/contact/'
            target = '_blank'>
            Contact us
        </Link>
    </Typography>
    <Typography
        color = 'textSecondary'
        variant = 'body2'>
        <Link
            color = 'inherit'
            href= 'https://riffanalytics.ai/privacy-policy/'
            target = '_blank'>
            Privacy Policy
        </Link>
    </Typography>
</div>
);
