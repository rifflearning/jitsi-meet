/* eslint-disable no-negated-condition */
/* eslint-disable react/jsx-no-bind */
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    FormControlLabel,
    Checkbox
} from '@material-ui/core/';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const TrustDialog = ({ isOpen, handleContinue, handleCancel }) => {
    const [ isMyComputer, setIsMyComputer ] = useState(true);

    const clearStorageAfterSessionFinished = value => {
        sessionStorage.setItem('clearStorage', value);
    };

    const onClickContinue = () => {
        if (!isMyComputer) {
            clearStorageAfterSessionFinished(true);
        } else {
            clearStorageAfterSessionFinished(false);
        }

        return handleContinue();
    };

    return (
        <Dialog
            onClose = { handleCancel }
            open = { isOpen }>
            <DialogTitle />
            <DialogContent>
                <Grid
                    container = { true }
                    spacing = { 1 }>

                    <Grid
                        item = { true }
                        xs = { 12 }>
                        <FormControlLabel
                            control = { <Checkbox
                                checked = { isMyComputer }
                                name = 'isMyComputer'
                                onChange = { e => setIsMyComputer(e.target.checked) } />
                            }
                            label = { 'It\'s my computer' } />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick = { onClickContinue }>Continue</Button>
                <Button
                    autoFocus = { true }
                    onClick = { handleCancel }>
                        Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

TrustDialog.propTypes = {
    handleCancel: PropTypes.func,
    handleContinue: PropTypes.func,
    isOpen: PropTypes.bool
};

export default TrustDialog;
