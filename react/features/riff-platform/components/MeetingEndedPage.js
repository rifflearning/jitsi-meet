import { Container, Typography } from '@material-ui/core';
import React from 'react';

export default () => (
    <Container
        component = 'main'
        maxWidth = 'xs'
        spacing = '5'>
        <Typography
            align = 'center'
            component = 'h4'
            variant = 'h4'>
            The meeting has ended.
        </Typography>
    </Container>
);
