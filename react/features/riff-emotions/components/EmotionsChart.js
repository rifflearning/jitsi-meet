/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import { ResponsiveContainer, BarChart, Bar, LabelList, Cell } from 'recharts';
import { connect } from '../../base/redux';
import { pickEmotionsDataById } from '../selectors';
import { getEmotionColor } from '../functions';

const EmotionsChart = ({ rawData, tileViewEnabled }) => {
  const refWrapper = useRef(null)
  const [data, setData] = useState([]);
  const [compound, setCompound] = useState('');

  useEffect(() => {
    if (!rawData || !rawData['face:0']) return;
    const mappedData = Object.keys(rawData['face:0'].avg_scores).map(
      emotion => ({
        name: emotion,
        value: Math.round(rawData['face:0'].avg_scores[emotion] * 1000),
        color: getEmotionColor(emotion)
      })
    );

    setData(mappedData);
    setCompound(rawData['face:0'].compound);
  }, [rawData]);

  const clientWidth = refWrapper?.current?.clientWidth || 400;
  const isLabelsEnabled = tileViewEnabled && clientWidth > 399;

  return (
    <div ref={refWrapper} style={styles.wrapper}>
      <div style={styles.textWrapper}>
        {compound &&
          <span style={styles.text}>
            {compound}
          </span>
        }
      </div>
      <ResponsiveContainer width="100%" height="50%">
        <BarChart
          width={500}
          height={200}
          data={data}
          >
          <Bar dataKey="value">
            {
              data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))
            }
          {isLabelsEnabled && <LabelList dataKey="name" position="insideBottom" fill='white' />}
        </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
};

const mapStateToProps = (state, ownProps) => ({
  rawData: pickEmotionsDataById(state, ownProps.id),
  tileViewEnabled: state['features/video-layout'].tileViewEnabled
});

const mapDispatchToProps = () => ({ });

export default connect(mapStateToProps, mapDispatchToProps)(EmotionsChart);

const styles = {
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width:'100%',
    height: '100%',
    zIndex: 1000,
    display:'flex',
    
    flexDirection:'column',
    justifyContent: 'space-between',
    opacity: '0.8',
    pointerEvents: 'none'
  },
  textWrapper: {
    textAlign: 'right',
    margin: `3px 5px`,
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'white'
  },
  text: {
    backgroundColor: '#000000bf',
    padding: '0 2px'
  }
}