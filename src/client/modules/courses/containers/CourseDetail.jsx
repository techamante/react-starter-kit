import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { Link, Route } from 'react-router-dom';
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
  Jumbotron,
  ListGroup,
  ListGroupItem,
  Badge,
  Media,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { AuthRoute } from '../../user/containers/Auth';
import FontAwesome from 'react-fontawesome';
import { PageLayout } from '../../common/components/web';
import VideoPlayer from '../../videos/containers/VideoPlayer';
import settings from '../../../../../settings';

const PageTitle = styled.h1`
  text-align: left;
`;

const Section = styled.section`
  margin-bottom: 30px;
`;

const coursesData = [
  { title: 'Chmistry 101' },
  { title: 'Chmistry 101' },
  { title: 'Chmistry 101' },
  { title: 'Chmistry 101' },
  { title: 'Chmistry 101' },
  { title: 'Chmistry 101' },
  { title: 'Chmistry 101' },
];

const CourseItem = ({ course, url }) => (
  <ListGroupItem className="justify-content-between">
    <Row>
      <Col>
        <FontAwesome
          name="rocket"
          style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
        />
        <Link to={`${url}/video/1`} style={{ marginLeft: '5px' }}>
          Video Title
        </Link>
      </Col>
      <Col>
        <span className="pull-right">05:00</span>
      </Col>
    </Row>
  </ListGroupItem>
);

const CoursesGroup = ({ courses, url }) => (
  <ListGroup>
    {courses.map(course => <CourseItem course={course} url={url} />)}
  </ListGroup>
);

const CounterView = ({ loading, match }) => {
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
      <PageTitle>Course Detail</PageTitle>
      <div>
        <Jumbotron>
          <h1 className="display-3">Hello, world!</h1>
          <p className="lead">
            This is a simple hero unit, a simple Jumbotron-style component for
            calling extra attention to featured content or information.
          </p>
          <hr className="my-2" />
          <p>
            It uses utility classes for typgraphy and spacing to space content
            out within the larger container.
          </p>
          <p className="lead">
            <Button color="primary">Learn More</Button>
          </p>
        </Jumbotron>
      </div>
      <Section>
        <h3>Videos</h3>
        <CoursesGroup courses={coursesData} url={match.url} />
      </Section>
      <AuthRoute path={`${match.url}/video/:videoId`} component={VideoPlayer} />
    </PageLayout>
  );
};

CounterView.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default CounterView;
