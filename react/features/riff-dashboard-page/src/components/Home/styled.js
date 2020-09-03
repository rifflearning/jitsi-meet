/* ******************************************************************************
 * styled.js                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview React components to apply styling to home components
 *
 * Created on       October 12, 2019
 * @author          Brec Hanson
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import styled from 'styled-components';

import { Colors, rgbaColor } from 'libs/utils';

const HomeContainer = styled.section`
    margin: 0 auto;
`;

const PrivacyCard = styled.div`
    background: ${Colors.selago};
    border-radius: 4px;
    height: 77px;
    border: solid 1px ${rgbaColor(Colors.riffViolet, 0.4)};
    display: flex;
    flex-direction: row;

    .security-icon {
      svg {
        color: ${Colors.riffVioletDark};
        height: 28px;
        width: 28px;
        margin: 12px;
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;

      .privacy-title {
        font-size: 16px;
        font-weight: 600;
        line-height: 1.63;
      }
      .sub-text {
        margin-top: 6px;
        color: ${Colors.tundora};
        font-size: 14px;
        line-height: 1.43;
        a {
            color: ${Colors.denim};
            text-decoration: underline;
        }
      }
    }
`;


const PostMeetingContainer = styled.div`
    padding: 60px 0;
    display: flex;
    flex-direction: row;
    position: relative;

    .music-notes-img {
        position: absolute;
        right: -42px;
        top: 32px;
    }

    .promo-text-container {
        padding-left: 48px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .promo-img {
        width: 48%;
        display: flex;
        align-self: center;
    }
`;

const UnorderedList = styled.ul`
    margin-top: 12px;
    margin-left: 48px;
    list-style: unset;

    li {
        margin-bottom: 6px;
    }
`;

const MetricsHelpContainer = styled.div`
    padding: 60px 0;
    display: flex;
    flex-direction: row;
    position: relative;

    .music-notes-img {
        position: absolute;
        left: -55px;
        top: 108px;
    }

    .metrics-promo-img {
        width: 46%;
        display: flex;
        margin-left: 48px;
        align-self: flex-start;
    }

    .promo-text-container {
        display: flex;
        flex-direction: column;

        .header-section {
            margin-bottom: 12px;
        }
    }
`;

const PromoImage = styled.img`
    width: 80%;
    display: block;
    margin: 0 auto;
`;

const FeedbackContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-image: linear-gradient(to bottom, #faeefd, ${Colors.white});
    padding: 60px 0;
    position: relative;

    .feedback-promo-img {
        width: 48%;
        display: flex;
        align-self: center;
    }

    .promo-text-container {
        padding-left: 48px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .music-notes-img {
        position: absolute;
        right: -28px;
        top: 32px;
    }
`;

const BetterCommunicationContainer = styled.div`
    padding: 36px 0;

    .better-comm-text {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .better-comm-image {
      display: flex;
      width: 46%;
      margin-left: 57px;
    }
`;

const MeasuringContainer = styled.div`
    padding-top: 36px;
    text-align: center;
    background-image: linear-gradient(to bottom, ${Colors.white}, ${Colors.selago});

    .info-text {
        max-width: 956px;
        margin: 0 auto;
        margin-top: 24px;
    }

    .measuring-cards-container {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 36px 0;
    }
`;

const MeasuringCard = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    border-radius: 4px;
    box-shadow: 8px 8px 10px 0 ${Colors.mischka}, -8px -8px 10px 0 ${rgbaColor(Colors.white, 0.5)};
    background-image: linear-gradient(137deg, #faeefd, ${Colors.white} 100%);
    margin-right: 24px;
    height: 398px;

    &:last-of-type {
      margin-right: 0;
    }

    .card-text {
      width: calc(100% - 48px);
      position: absolute;
      bottom: 0;
      left: 24px;
    }
`;

const MeasuringCardImg = styled.div`
    width: calc(100% - 48px);
    position: absolute;
    top: ${props => props.top ? props.top : '50%'};
    left: 24px;
    transform: translateY(-50%);

    img {
      display: block;
      width: 100%;
    }
`;

const MeasuringCardTitle = styled.p`
    margin: 36px;
    margin-bottom: ${props => props.marginBottom};
    color: ${rgbaColor(Colors.black, 0.87)};
    font-size: 24px;
    font-weight: 600;
    line-height: normal;
    letter-spacing: 0.5px;
    text-align: center;
`;

const HomeParagraph = styled.p`
    line-height: ${props => props.lineHeight ? props.lineHeight : 'unset'};
    font-size: ${props => props.fontSize ? props.fontSize : '20px'};
    margin: ${props => props.margin ? props.margin : '24px 0'};
`;

const HomeSectionInner = styled.div`
    max-width: 1440px;
    padding: 0 144px;
    margin: 0 auto;
    display: flex;
    flex-direction: ${props => props.flexDirection ? props.flexDirection : 'row'};
`;

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    HomeContainer,
    HomeSectionInner,
    PrivacyCard,
    PostMeetingContainer,
    UnorderedList,
    MeasuringCard,
    MeasuringCardImg,
    MeasuringCardTitle,
    MetricsHelpContainer,
    PromoImage,
    FeedbackContainer,
    BetterCommunicationContainer,
    MeasuringContainer,
    HomeParagraph,
};
