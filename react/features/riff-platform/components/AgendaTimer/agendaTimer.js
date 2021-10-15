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
            currentTime: 0,
            noEventsLeft: false
        };
    }

    componentDidMount() {
        this.startTimer();
    }

    startTimer() {
        // eslint-disable-next-line sort-vars
        let timer = this.state.agendaData[this.state.currentEventIndex].duration * 60, minutes, seconds;

        setInterval(() => {

            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            this.setState({ currentTime: `${minutes}:${seconds}` });

            if (--timer < 0) {
                if ((this.state.agendaData.length - 1) > this.state.currentEventIndex) {
                    this.setState({ currentEventIndex: this.state.currentEventIndex + 1 });

                    timer = this.state.agendaData[this.state.currentEventIndex].duration * 60;
                } else {
                    console.log('IN STEP 2');
                    this.setState({ noEventsLeft: true });
                }
            }
        }, 1000);
    }

    render() {
        // const bounds = {
        //     left: -200,
        //     top: -250,
        //     right: 400,
        //     bottom: 400
        // };

        return (
            <div>
                <div id = 'agenda-timer-wrapper'>
                    {!this.state.noEventsLeft && <div
                        className = { 'agenda-timer' }>
                        <div className = { 'agenda-timer-label' }>
                            {`${this.state.agendaData[this.state.currentEventIndex].name}:`}
                        </div>
                        <div classNAme = { 'agenda-timer-time' }> {`${this.state.currentTime}`}
                        </div>
                    </div>}
                    {this.state.noEventsLeft && <div
                        className = { 'agenda-timer' }>
                        <div className = { 'agenda-timer-label' }>
                            {'No more events remaining!'}
                        </div>
                    </div>}
                </div>
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
