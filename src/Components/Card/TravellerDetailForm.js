import './card.scss';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import VAR from '../../variables';
import emailjs from 'emailjs-com';
import { FullPageLoader } from '../index';

const TravellerDetailForm = ({ flightId }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const service_id = 'service_806ruid';
  const template_id = 'template_uw50gqm';
  const user_id = 'user_lkwuhptAYqFFFhgOEij13';

  const initalTavellerDetailVar = { name: '', email: '', phone: '' };

  const validateTravellerDetail = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Required';
    }
    if (!values.phone) {
      errors.phone = 'Required';
    }
    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    return errors;
  };

  const onSubmitTravellerDetailEvent = (values, { setSubmitting }) => {
    setIsLoading(true);
    const { name, email, phone } = values;
    const _data = { name, email, number: phone, flightId };
    axios
      .post(`${VAR.baseURL}/booking`, _data)
      .then((res) => {
        console.log(res.data.booking);
        const mail_data = {
          email: email,
          name: name,
        };
        emailjs.send(service_id, template_id, mail_data, user_id).then(
          () => {
            navigate('/confirm/' + res.data.booking._id);
            setIsLoading(true);
          },
          () => {
            navigate('/error');
            setIsLoading(true);
          }
        );
      })
      .catch((err) => console.log(err));
    setSubmitting(false);
  };

  return (
    <div className="traveller_detail_card_container">
      <h1 className="header">Add traveller details</h1>
      <Formik
        initialValues={initalTavellerDetailVar}
        validate={validateTravellerDetail}
        onSubmit={onSubmitTravellerDetailEvent}
      >
        {({ isSubmitting }) => (
          <Form className="main_form">
            <div className="input_container">
              <label>Full Name</label>
              <Field type="text" name="name" placeholder="Full Name" />
              <ErrorMessage name="name" component="span" />
            </div>
            <div className="input_container">
              <label>Phone Number</label>
              <Field type="number" name="phone" placeholder="Phone Number" />
              <ErrorMessage name="phone" component="span" />
            </div>
            <div className="input_container">
              <label>Email</label>
              <Field type="email" name="email" placeholder="Email" />
              <ErrorMessage name="email" component="span" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Book Now
            </button>
          </Form>
        )}
      </Formik>
      {isLoading === true ? <FullPageLoader /> : null}
    </div>
  );
};

export default TravellerDetailForm;
