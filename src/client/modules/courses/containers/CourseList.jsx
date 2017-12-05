import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Col,
  Row,
} from 'reactstrap';
import { PageLayout } from '../../common/components/web';

import settings from '../../../../../settings';

const curriculumsData = [
  {
    title: 'Chemistry',
  },
  {
    title: 'Biology',
  },
];

const PageTitle = styled.h1`
  text-align: left;
`;

const Section = styled.section`
  margin-bottom: 30px;
`;

const CounterView = ({ loading }) => {
  const renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - Curriculums`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - Counter example page`,
        },
      ]}
    />
  );

  const CurriculumCard = ({ curriculum }) => (
    <Col sm="6">
      <Card>
        <CardImg
          top
          width="100%"
          src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"
          alt="Card image cap"
        />
        <CardBody>
          <CardTitle>Card title</CardTitle>
          <CardSubtitle>Card subtitle</CardSubtitle>
          <CardText>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </CardText>
          <Button default>
            <Link className="post-link" to={`/curriculums/1`}>
              View Curriculum
            </Link>
          </Button>
        </CardBody>
      </Card>
    </Col>
  );

  const CurriculumList = ({ curriculums }) => (
    <Row>
      {curriculums.map(curriculum => (
        <CurriculumCard curriculum={curriculum} />
      ))}
    </Row>
  );

  if (loading) {
    return (
      <PageLayout>
        {renderMetaData()}
        <div className="text-center">Loading...</div>
      </PageLayout>
    );
  }
  return (
    <PageLayout>
      {renderMetaData()}
      <Section>
        <PageTitle>Courses</PageTitle>
        <CurriculumList curriculums={curriculumsData} />
      </Section>
    </PageLayout>
  );
};

CounterView.propTypes = {
  loading: PropTypes.bool.isRequired,
  counter: PropTypes.object,
  addCounter: PropTypes.func.isRequired,
  reduxCount: PropTypes.number.isRequired,
  onReduxIncrement: PropTypes.func.isRequired,
};

export default CounterView;
