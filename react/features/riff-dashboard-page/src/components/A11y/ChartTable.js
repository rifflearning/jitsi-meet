/* ******************************************************************************
 * ChartTable.jsx                                                               *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for rendering tabular data for a11y
 *
 * [More detail about the file's contents]
 *
 * Created on       January 13, 2019
 * @author          Ari Rizzitano
 *
 * @copyright (c) 2019-present Riff Learning, Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// Screen Reader Only div
const SROnly = styled.div`
    position:absolute;
    top:auto;
    width:1px;
    height:1px;
    overflow:hidden;
`;

/* ******************************************************************************
 * ChartTable                                                              */ /**
 *
 * React component which builds an a11y table of tabular data (probably rendered
 * visually in some other way) for Screen Readers.
 *
 ********************************************************************************/
class ChartTable extends React.Component {
    static propTypes = {

        /** Array of data for the rows of the table, the 1st element is the header for the row */
        rows: PropTypes.array.isRequired,

        /** Array of headers for the columns of the table */
        cols: PropTypes.array.isRequired,

        /** Optional caption for the table */
        caption: PropTypes.string,
    }

    render() {
        if (this.props.rows.length === 0) {
            return null;
        }

        const tableCaption = this.props.caption ? <caption>{this.props.caption}</caption> : null;

        return (
            <SROnly>
                <table>
                    {tableCaption}
                    <thead>
                        <tr>
                            {this.props.cols.map(col => (               // eslint-disable-line no-extra-parens
                                <th key={col} scope='column'>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.rows.map(row => (                   // eslint-disable-line no-extra-parens
                            <tr key={row[0]}>
                                <th scope='row'>{row[0]}</th>
                                {row.slice(1).map(cell => (             // eslint-disable-line no-extra-parens
                                    <td key={cell}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </SROnly>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ChartTable,
};
