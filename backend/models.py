from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
db=SQLAlchemy()

class Session(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    track=db.Column(db.String(50),nullable=False)
    question=db.Column(db.Text,nullable=False)
    answer=db.Column(db.Text,nullable=False)
    created_at=db.Column(db.DateTime,default=datetime.utcnow)

    results=db.relationship('PersonaResult',backref='session',cascade="all,delete-orphan")

class PersonaResult(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    session_id=db.Column(db.Integer,db.ForeignKey('session.id'),nullable=False)
    persona_name=db.Column(db.String(100),nullable=False)
    score=db.Column(db.Integer,nullable=False)
    reasoning=db.Column(db.Text,nullable=False)