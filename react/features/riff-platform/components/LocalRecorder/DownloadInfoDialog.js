/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable require-jsdoc */

import { Typography } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import { hideDialog, Dialog } from '../../../base/dialog';
import { connect } from '../../../base/redux';

import { recordingController } from './LocalRecorderController';

const useStyles = makeStyles(() => {
    return {
        root: {
            width: '100%',
            maxWidth: 360,
            backgroundColor: 'none'
        },
        paper: {
            width: '80%',
            maxHeight: 435
        },
        info: {
            fontSize: '0.8rem'
        },
        autoRecording: {
            marginTop: '1rem',
            fontSize: '0.8rem',
            fontWeight: 'bold'
        }
    };
});

function DownloadInfoDialog({ onClose }) {
    const [ startAutoDownloading, setStartAutoDownloading ] = useState(false);
    const [ counter, setCounter ] = useState(15);

    const classes = useStyles();
    const onSubmit = () => {
        recordingController.onMemoryExceededDownload();
        onClose();
    };

    useEffect(() => {
        const timer = counter > 0
        && setInterval(() => {
            if (counter === 10) {
                setStartAutoDownloading(true);
            }
            setCounter(counter - 1);
        }, 1000);

        if (counter === 0) {
            onSubmit();
        }

        return () => clearInterval(timer);
    }, [ counter ]);

    return (
        <Dialog
            className = { classes.root }
            isModal = { true }
            maxWidth = 'md'
            okKey = 'Download recording'
            onSubmit = { onSubmit }
            open = { true }>
            <Typography style = {{ fontSize: '1.5rem' }}>Local Recording</Typography>
            <DialogContent dividers = { true }>
                <Typography className = { classes.info }>
                    Memory limit exceeded. To download the recording file click on download recording.
                </Typography>
                {startAutoDownloading
                && <Typography className = { classes.autoRecording }>
                    {`Download will start in ${counter} seconds`}
                </Typography>
                }
            </DialogContent>
        </Dialog>
    );
}

DownloadInfoDialog.propTypes = {
    onClose: PropTypes.func
};

const mapStateToProps = () => {
    return { };
};

const mapDispatchToProps = dispatch => {
    return {
        onClose: () => dispatch(hideDialog())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadInfoDialog);
