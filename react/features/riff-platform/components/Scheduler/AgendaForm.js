/* eslint-disable import/order */
/* eslint-disable max-len */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */

import {
    Button,
    Grid,
    TextField,
    Typography,
    List,
    ListItem,
    ListItemSecondaryAction
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import RootRef from '@material-ui/core/RootRef';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

// eslint-disable-next-line import/order
import React from 'react'; // useCallback,

// eslint-disable-next-line import/order
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

/* class */
class AgendaForm extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            previousState: {},
            showAgenda: false,
            tooLongAgendaDur: false,
            invalidAgendaItems: false
        };

        this.onAgendaEntryChange = this.onAgendaEntryChange.bind(this);
        this.isAgendaInputValid = this.isAgendaInputValid.bind(this);
    }

    render() {

        console.log('OLIVER classes', this.props.classes);
        const addRowButton = (
            <Button
                className = { this.props.classes.submit }
                onClick = { () => this.props.setAgendaData(this.props.agendaData.concat(this.createAgendaData())) }
                variant = 'outlined'>
                {'Add Row'}
                <AddIcon className = { this.props.classes.rightIcon } />
            </Button>
        );

        const onDragEnd = result => {
            // if dropped outside the list, revert to prior order
            if (!result.destination) {
                return;
            }

            // else reorder based off of where you drop the item
            const newData = this.reorder(
                this.props.agendaData,
                result.source.index,
                result.destination.index
            );

            this.props.setAgendaData(newData);
        };

        console.info('OLIVER props', this.props);

        return (
            <Grid>
                {addRowButton}
                <DragDropContext
                    onDragEnd = { onDragEnd }>
                    <Droppable droppableId = 'droppable'>
                        {(provided, snapshot) => (
                            <RootRef rootRef = { provided.innerRef }>
                                <List
                                    style = { this.getListStyle(snapshot.isDraggingOver) }
                                    className = { this.props.classes.list }>
                                    {this.props.agendaData.map((item, index) => (
                                        <Draggable
                                            draggableId = { String(item.id) }
                                            index = { index }
                                            key = { item.id }>
                                            {/* eslint-disable-next-line no-shadow */}
                                            {(provided, snapshot) => (
                                                <ListItem
                                                    ContainerComponent = 'li'
                                                    ContainerProps = {{ ref: provided.innerRef }}
                                                    { ...provided.draggableProps }
                                                    { ...provided.dragHandleProps }
                                                    style = { this.getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    ) }>
                                                    <ListItem >
                                                        <TextField
                                                            type = { 'agendaInput' }
                                                            variant = { 'standard' }
                                                            value = { item.name }
                                                            name = { 'name' }
                                                            onChange = { entry => this.onAgendaEntryChange(entry, item) }
                                                            className = { this.props.classes.eventInput }
                                                            error = { !this.isAgendaInputValid(item.name, name) }
                                                            placeholder = { 'Discussion Topic' }
                                                            required = { true } />
                                                    </ListItem>
                                                    <ListItem >
                                                        <TextField
                                                            type = 'agendaInput'
                                                            variant = 'standard'
                                                            value = { item.duration }
                                                            name = { 'duration' }
                                                            onChange = { entry => this.onAgendaEntryChange(entry, item) }
                                                            className = { this.props.classes.input }
                                                            error = { !this.isAgendaInputValid(item.duration, name) }
                                                            placeholder = { 'Duration (min)' }
                                                            required = { true } />
                                                    </ListItem>
                                                    <IconButton
                                                        aria-label = 'delete'
                                                        onClick = { () => this.onAgendaEntryDelete(item) }>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <ListItemSecondaryAction />
                                                </ListItem>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </List>
                            </RootRef>
                        )}
                    </Droppable>
                </DragDropContext>
                <Grid>
                    <Grid
                        container = { true }
                        item = { true }
                        xs = { 12 }
                        sm = { 8 }
                        md = { 10 }
                        spacing = { 3 }>
                        <Grid
                            item = { true }
                            xs = { 12 }
                            md = { 4 }>
                            {Boolean(this.props.agendaError)
                                && <Grid className = { this.props.classes.helperTextContainer }>
                                    <Typography
                                        className = { this.props.classes.errorText }>
                                        {this.props.agendaError}
                                    </Typography>
                                </Grid>}
                            {this.state.tooLongAgendaDur
                                && <Grid className = { this.props.classes.helperTextContainer }>
                                    <Typography
                                        className = { this.props.classes.warningText }>
                                        The duration of your agenda items is greater than the duration of the meeting
                                    </Typography>
                                </Grid>}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

    isAgendaInputValid(inputValue, source) {
        if (this.state.invalidAgendaItems) {
            if (!inputValue) {
                return false;
            }

            if (source === 'duration') {
                const validDurCheck = !isNaN(inputValue) && inputValue > 0;

                return validDurCheck;
            }
        }

        return true;
    }

    createAgendaData() {
        const idIndex = this.props.agendaData.reduce((max, item) => {
            if (item.id > max) {
                return item.id;
            }

            return max;
        }, 0) + 1;

        return {
            id: idIndex,
            name: '',
            duration: ''
        };
    }

    onAgendaEntryDelete(row) {
        if (!this.state.previousState[row.id]) {
            this.setState({
                previousState: state => {
                    return {
                        ...state,
                        [row.id]: row
                    };
                }
            });
        }

        const { id } = row;
        let newData = this.props.agendaData.filter(oldRow => oldRow.id !== id);

        if (newData.length === 0) {
            newData = [ this.createAgendaData() ];
            this.props.setShowAgenda(false);
        }
        this.props.setAgendaData(newData);

        // this.setState({ agendaData: newData });
        this.checkAgendaDuration(newData);
    }

    checkAgendaDuration(data) {
        const totAgendaDur = data.reduce((tot, entry) => tot + entry.duration, 0);
        const totMeetingDur = (this.props.hours * 60) + this.props.minutes;
        const result = totMeetingDur < totAgendaDur;

        this.setState({ tooLongAgendaDur: result });
    }

    onAgendaEntryChange(e, rowToChange) {
        if (!rowToChange.id) {
            this.setState({
                previousState: state => {
                    return {
                        ...state,
                        [rowToChange.id]: rowToChange
                    };
                }
            });
        }
        const value = e.target.value;
        // eslint-disable-next-line no-shadow
        const name = e.target.name;

        const { id } = rowToChange;
        // eslint-disable-next-line no-shadow
        const newData = this.props.agendaData.map(row => {
            if (row.id === id) {
                if (name === 'duration') {
                    const durVal = isNaN(parseFloat(value)) ? '' : parseFloat(value);

                    return {
                        ...row,
                        [name]: durVal
                    };
                }

                return {
                    ...row,
                    [name]: value
                };
            }

            return row;
        });

        this.props.setAgendaData(newData);

        // check to see if the sum of all agenda items is greater than the duration of the meeting
        if (name === 'duration') {
            // eslint-disable-next-line no-use-before-define
            this.checkAgendaDuration(newData);
        }
    }


    getItemStyle(isDragging, draggableStyle) {
        return {
            // styles we need to apply on draggables
            ...draggableStyle,

            ...isDragging && {
                background: 'primary'
            }
        };
    }

    getListStyle(isDraggingOver) {
        return {
            border: isDraggingOver ? '1px solid white' : '1px solid #606060',
            padding: 'grid',
            width: 600
        };
    }

    reorder(list, startIndex, endIndex) {
        const result = Array.from(list);
        const [ removed ] = result.splice(startIndex, 1);

        result.splice(endIndex, 0, removed);

        return result;
    }
}

export {
    AgendaForm
};
