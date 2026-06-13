import React, { useState } from 'react';
import { FiGithub, FiLinkedin, FiMail, FiMapPin, FiSend, FiShield } from 'react-icons/fi';
import { sendContactMessage } from '../services/contactService';
import '../Contact.css';

const CONTACT_CHANNELS = [
  {
    icon: FiMail,
    title: 'hola@jmricoma.com',
    subtitle: 'Resposta ràpida',
    href: 'mailto:hola@jmricoma.com',
  },
  {
    icon: FiLinkedin,
    title: 'linkedin.com/in/jmricoma',
    subtitle: 'Connectem',
    href: 'https://linkedin.com/in/jmricoma',
  },
  {
    icon: FiGithub,
    title: 'github.com/jmricoma',
    subtitle: 'El meu codi',
    href: 'https://github.com/jmricoma',
  },
  {
    icon: FiMapPin,
    title: 'Valldoreix, Barcelona',
    subtitle: 'Remot · Híbrid · Presencial',
  },
];

const Contact = () => {
  const [formState, setFormState] = useState({
    status: 'idle',
    message: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setFormState({
      status: 'sending',
      message: 'Enviant el missatge...',
    });

    try {
      await sendContactMessage({
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
      });

      form.reset();
      setFormState({
        status: 'success',
        message: 'Missatge enviat correctament. Et respondré tan aviat com pugui.',
      });
    } catch (error) {
      setFormState({
        status: 'error',
        message: error.response?.data?.messages?.error || 'No he pogut enviar el missatge. Prova-ho de nou o escriu-me directament per email.',
      });
    }
  };

  return (
    <main className="contact-page">
      <section
        className="contact-hero"
        style={{ '--contact-background-image': `url(${process.env.PUBLIC_URL}/uploads/background-header.png)` }}
      >
        <div className="contact-background" aria-hidden="true">
          <pre>{`<?php
namespace App\\Service;

use Symfony\\Component\\HttpClient\\HttpClient;

class ProjectService
{
    public function getProjects(): array
    {
        $response = $this->client->request('GET', '/api/projects');

        return $response->toArray();
    }
}`}</pre>
        </div>

        <div className="contact-shell">
          <div className="contact-grid">
            <div className="contact-copy">
              <p className="contact-kicker">Contactar</p>
              <h1>
                Tens un projecte
                <span> en ment?</span>
                <strong> Parlem-ne.</strong>
              </h1>
              <p className="contact-description">
                Si busques un desenvolupador PHP / Symfony amb experiència en aplicacions empresarials, APIs, integracions i desenvolupament a mida, estaré encantat de conèixer el teu projecte.
              </p>
              <a className="contact-primary-link" href="mailto:hola@jmricoma.com">
                <FiSend aria-hidden="true" />
                Enviar correu
              </a>
            </div>

            <form className="contact-form-card" onSubmit={handleSubmit}>
              <h2>Envia'm un missatge</h2>

              <label>
                <span>Nom</span>
                <input type="text" name="name" placeholder="El teu nom" required />
              </label>

              <label>
                <span>Email</span>
                <input type="email" name="email" placeholder="El teu email" required />
              </label>

              <label>
                <span>Missatge</span>
                <textarea name="message" rows="5" placeholder="Explica'm el teu projecte..." required />
              </label>

              <button type="submit" disabled={formState.status === 'sending'}>
                <FiSend aria-hidden="true" />
                {formState.status === 'sending' ? 'Enviant...' : 'Enviar missatge'}
              </button>

              <div className="contact-privacy">
                <FiShield aria-hidden="true" />
                <p>
                  <strong>Les teves dades estan segures.</strong>
                  <span>No comparteixo la teva informació amb tercers.</span>
                </p>
              </div>

              {formState.message && (
                <p className={`contact-form-feedback contact-form-feedback--${formState.status}`}>
                  {formState.message}
                </p>
              )}
            </form>
          </div>

          <div className="contact-channel-list">
            {CONTACT_CHANNELS.map((channel) => {
              const Icon = channel.icon;
              const content = (
                <>
                  <span className="contact-channel-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{channel.title}</strong>
                    <small>{channel.subtitle}</small>
                  </span>
                </>
              );

              return channel.href ? (
                <a key={channel.title} href={channel.href} target={channel.href.startsWith('http') ? '_blank' : undefined} rel={channel.href.startsWith('http') ? 'noreferrer' : undefined}>
                  {content}
                </a>
              ) : (
                <span key={channel.title}>
                  {content}
                </span>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
