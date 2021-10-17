/* eslint-disable require-jsdoc */
import React from 'react';

// import Draggable from 'react-draggable';

class DraggableAgendaTimer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            agendaData: [
                {
                    id: -1,
                    name: 'Event 1',
                    duration: '.1',
                    isEditMode: true
                },
                {
                    id: 0,
                    name: 'Event 2',
                    duration: '.5',
                    isEditMode: true
                }
            ],
            currentEventIndex: 0,
            currentLabel: '',
            currentTime: '',
            useEventStyle: false,
            noEventsLeft: false,
            timerIsShowing: true
        };
    }

    componentDidMount() {
        this.startTimer();
    }

    startTimer() {
        // eslint-disable-next-line sort-vars
        let timer = this.state.agendaData[this.state.currentEventIndex].duration * 60, minutes, seconds;

        setInterval(() => {
            this.setState({ useEventStyle: false });
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            this.setState({ currentTime: `${minutes}:${seconds}` });
            if (this.state.currentLabel !== this.state.agendaData[this.state.currentEventIndex].name) {
                this.setState({ currentLabel: `${this.state.agendaData[this.state.currentEventIndex].name}:` });
            }
            if (--timer < 0) {
                if ((this.state.agendaData.length - 1) > this.state.currentEventIndex) {
                    this.setState({ currentEventIndex: this.state.currentEventIndex + 1 });
                    this.setState({ useEventStyle: true });
                    timer = this.state.agendaData[this.state.currentEventIndex].duration * 60;
                } else {
                    this.setState({ useEventStyle: true });
                    this.setState({ noEventsLeft: true });
                    this.hideTimer();
                }
            }
        }, 1000);
    }

    hideTimer() {
        setInterval(() => {
            this.setState({ timerIsShowing: false });
        }, 3000);
    }

    render() {

        const currClass = this.state.useEventStyle ? 'agenda-timer-event' : 'agenda-timer';

        const agendaTimerContents = this.state.noEventsLeft
            ? (<div className = { 'agenda-timer-label' }>
                {'No more agenda items'}
            </div>)
            : (<div className = { 'agenda-timer-label' }>
                {`${this.state.currentLabel}`}
                <div classNAme = { 'agenda-timer-time' }>
                    {`${this.state.currentTime}`}
                </div>
            </div>);


        const showTimer = this.state.timerIsShowing;

        return (
            <div>
                {showTimer && <div id = 'agenda-timer-wrapper'>
                    <div className = { currClass }>
                        {agendaTimerContents}
                    </div>
                </div>}
            </div>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    DraggableAgendaTimer
};
