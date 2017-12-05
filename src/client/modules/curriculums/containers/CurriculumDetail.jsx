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
  Jumbotron,
  ListGroup,
  ListGroupItem,
  Badge,
  Media,
} from 'reactstrap';
import { PageLayout } from '../../common/components/web';

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

const CourseItem = ({ course }) => (
  <ListGroupItem className="justify-content-between">
    <Media>
      <Media left href="#">
        <Media
          object
          src="http://via.placeholder.com/150x150"
          alt="Generic placeholder image"
        />
      </Media>
      <Media body style={{ marginLeft: '15px' }}>
        <Media heading>Media heading</Media>
        Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque
        ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at,
        tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate
        fringilla. Donec lacinia congue felis in faucibus.
        <Link className="post-link" to={`/courses/1`}>
          View Course
        </Link>
      </Media>
    </Media>
  </ListGroupItem>
);

const CoursesGroup = ({ courses }) => (
  <ListGroup>{courses.map(course => <CourseItem course={course} />)}</ListGroup>
);

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
      <div>
        <PageTitle>Hello Curriculum</PageTitle>
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
        <h3>Courses</h3>
        <CoursesGroup courses={coursesData} />
      </Section>
    </PageLayout>
  );
};

CounterView.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default CounterView;
