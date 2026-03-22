import Question from '../models/question.js';

export const getAllQuestions = async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
};

export const getRandomTest = async (req, res) => {
  const questions = await Question.aggregate([{ $sample: { size: 20 } }]);

  res.json(questions);
};

export const getQuestionsByUnit = async (req, res) => {
  let { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Вкажіть номер розділу' });
  }

  try {
    const unitNumber = id.toLowerCase().startsWith('r') ? id.substring(1) : id;

    const questions = await Question.find({
      id: { $regex: `^r${unitNumber}q`, $options: 'i' },
    });

    if (questions.length === 0) {
      return res.status(404).json({ message: `Питання не знайдені` });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}/images/`;

    const questionsWithImages = questions.map((q) => {
      const doc = q.toObject();

      if (doc.image && Array.isArray(doc.image)) {
        doc.image = doc.image.map(imgName => `${baseUrl}${imgName}`);
      }

      return doc;
    });
    res.json(questionsWithImages);
    
  } catch (err) {
    res.status(500).json({ error: 'Помилка сервера: ' + err.message });
  }
};
