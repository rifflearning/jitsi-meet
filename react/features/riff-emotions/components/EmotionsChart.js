/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import { ResponsiveContainer, BarChart, Bar, LabelList, Cell } from 'recharts';
import { connect } from '../../base/redux';
import { pickEmotionsDataById } from '../selectors';
import { getEmotionColor } from '../functions';

const EmotionsChart = ({ id, data: rawDataFromProps }) => {
  const refWrapper = useRef(null)
  const [data, setData] = useState([]);
  const [compound, setCompound] = useState('');

  useEffect(() => {
    if (!rawDataFromProps || !rawDataFromProps['face:0']) return;
    const mappedData = Object.keys(rawDataFromProps['face:0'].avg_scores).map(
      emotion => ({
        name: emotion,
        value: Math.round(rawDataFromProps['face:0'].avg_scores[emotion] * 1000),
        color: getEmotionColor(emotion)
      })
    );

    setData(mappedData);
    setCompound(rawDataFromProps['face:0'].compound);
  }, [rawDataFromProps]);

  const clientWidth = refWrapper?.current?.clientWidth || 400;
  const sizeW = clientWidth;
  const sizeH = sizeW/2;
  const sizeM = Math.round(sizeW / 40);
  const isBig = sizeW > 399;

  return (
    <div ref={refWrapper} style={{
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
    }}>
      <div style={{ textAlign: 'right', margin: `3px 5px`, fontSize: '12px', fontWeight: 'bold', color: 'white' }}>
        <span style={{backgroundColor:'#000000bf', padding:'0 2px'}}>
        {id}: {compound}
        </span>
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
          {isBig && <LabelList dataKey="name" position="insideBottom" fill='white' />}
        </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
};

const mapStateToProps = (state, ownProps) => ({
  data: pickEmotionsDataById(state, ownProps.id)
});

const mapDispatchToProps = () => ({ });

export default connect(mapStateToProps, mapDispatchToProps)(EmotionsChart);
