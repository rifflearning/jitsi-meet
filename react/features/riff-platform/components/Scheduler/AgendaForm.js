/* ******************************************************************************
 * AgendaForm.js                                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to allow users to create an agenda in the
 * scheduler form.
 *
 * Created on       November 22, 2021
 * @author          Oliver Millard
 *
 * @copyright (c) 2021-present Riff Analytics,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
/* eslint-disable react/jsx-sort-props */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable valid-jsdoc */

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
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

/* ******************************************************************************
 * AgendaForm                                                            */ /**
 *
 * React component which allows users to input agenda items and drag and drop
 * them to reorder them in the list.
 *
 ********************************************************************************/
class AgendaForm extends React.PureComponent {

    /* **************************************************************************
     * constructor                                                         */ /**
     */
    constructor(props) {
        super(props);

        this.state = {
            previousOrder: {},
            tooLongAgendaDur: false
        };

        this.onAgendaEntryChange = this.onAgendaEntryChange.bind(this);
        this.isAgendaInputValid = this.isAgendaInputValid.bind(this);
    }

    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     *
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
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

        return (
            <Grid>
                {addRowButton}
                <DragDropContext
                    onDragEnd = { onDragEnd }>
                    <Droppable droppableId = 'droppable'>
                        {(provided, snapshot) => (
                            <RootRef rootRef = { provided.innerRef }>
                                <List
                                    className = { this.props.classes.list }
                                    style = { this.getListStyle(snapshot.isDraggingOver) }>
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
                                                            className = { this.props.classes.eventInput }
                                                            error = { !this.isAgendaInputValid(item.name, name) }
                                                            name = { 'name' }
                                                            onChange = {
                                                                entry => this.onAgendaEntryChange(entry, item)
                                                            }
                                                            placeholder = { 'Discussion Topic' }
                                                            required = { true }
                                                            type = { 'agendaInput' }
                                                            value = { item.name }
                                                            variant = { 'standard' } />
                                                    </ListItem>
                                                    <ListItem >
                                                        <TextField
                                                            className = { this.props.classes.input }
                                                            error = { !this.isAgendaInputValid(item.duration, name) }
                                                            name = { 'duration' }
                                                            onChange = {
                                                                entry => this.onAgendaEntryChange(entry, item)
                                                            }
                                                            placeholder = { 'Duration (min)' }
                                                            required = { true }
                                                            type = 'agendaInput'
                                                            value = { item.duration }
                                                            variant = 'standard' />
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

    /* **************************************************************************
     * isAgendaInputValid                                                  */ /**
     *
     * Checks to see if the value that has been inputted into a text field is
     * valid for that specific field.
     *
     * @param {string} inputValue - The inputted value into the field.
     * @param {string} source - The source of the text, either eventName or duration.
     */
    isAgendaInputValid(inputValue, source) {
        if (this.props.invalidAgendaItems) {
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

    /* **************************************************************************
     * createAgendaData                                                    */ /**
     *
     * Creates the agenda data for the meeting.
     *
     */
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

    /* **************************************************************************
     * onAgendaEntryDelete                                                 */ /**
     *
     * Handles the deletion of rows in the agenda form.
     *
     * @param {object} row - The row which is going to be deleted.
     */
    onAgendaEntryDelete(row) {
        if (!this.state.previousOrder[row.id]) {
            this.setState({
                previousOrder: state => {
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

    /* **************************************************************************
     * checkAgendaDuration                                                 */ /**
     *
     * Checks if the sum of the duration fields of all the agenda entries is greater
     * than the set duration of the meeting.
     *
     * @param {object} data - The agenda data being checked.
     */
    checkAgendaDuration(data) {
        const totAgendaDur = data.reduce((tot, entry) => tot + entry.duration, 0);
        const totMeetingDur = (this.props.hours * 60) + this.props.minutes;
        const result = totMeetingDur < totAgendaDur;

        this.setState({ tooLongAgendaDur: result });
    }

    /* **************************************************************************
     * onAgendaEntryChange                                                 */ /**
     *
     * Handles moving agenda rows by dragging and dropping.
     *
     * @param {event} e - The event transpiring when a user moves a row.
     * @param {object} rowToChange - The row that is being moved.
     */
    onAgendaEntryChange(e, rowToChange) {
        if (!rowToChange.id) {
            this.setState({
                previousOrder: state => {
                    return {
                        ...state,
                        [rowToChange.id]: rowToChange
                    };
                }
            });
        }
        const value = e.target.value;
        const name = e.target.name;
        const { id } = rowToChange;

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

    /* **************************************************************************
     * getItemStyle                                                        */ /**
     *
     * Handles changing the style of agenda rows when they are being dragged.
     *
     * @param {boolean} isDragging - Check if the user is dragging a row.
     * @param {object} draggableStyle - The new style when dragging.
     */
    getItemStyle(isDragging, draggableStyle) {
        return {
            // styles we need to apply on draggables
            ...draggableStyle,

            ...isDragging && {
                background: 'primary'
            }
        };
    }

    /* **************************************************************************
     * getListStyle                                                        */ /**
     *
     * Change the style of the whole list when the user is dragging a row.
     *
     * @param {boolean} isDraggingOver - Check if the user has stopped dragging a row.
     */
    getListStyle(isDraggingOver) {
        return {
            border: isDraggingOver ? '1px solid white' : '1px solid #606060',
            padding: 'grid',
            width: 600
        };
    }

    /* **************************************************************************
     * reorder                                                             */ /**
     *
     * Handles reordering the agenda items after they've been dragged and dropped.
     *
     * @param {List} list - The agenda list in the scheduler form.
     * @param {number} startIndex - The index at which the list item started.
     * @param {number} endIndex - The index at which the list item ended up at.
     */
    reorder(list, startIndex, endIndex) {
        const result = Array.from(list);
        const [ removed ] = result.splice(startIndex, 1);

        result.splice(endIndex, 0, removed);

        return result;
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    AgendaForm
};
