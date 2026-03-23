import Question from '../models/question.js';

const formatQuestionsWithImages = (req, questions) => {
  const baseUrl = `${req.protocol}://${req.get('host')}/images/`;

  return questions.map((q) => {
    const doc = q.toObject ? q.toObject() : q;

    if (doc.image && Array.isArray(doc.image)) {
      doc.image = doc.image.map((imgName) => `${baseUrl}${imgName}`);
    } else if (doc.image && typeof doc.image === 'string') {
      // Про всяк випадок, якщо картинка записана рядком, а не масивом
      doc.image = `${baseUrl}${doc.image}`;
    }

    return doc;
  });
};

export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    const formatted = formatQuestionsWithImages(req, questions);
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Помилка сервера: ' + err.message });
  }
};

export const getRandomTest = async (req, res) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 20 } }]);
    const formatted = formatQuestionsWithImages(req, questions);
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Помилка сервера: ' + err.message });
  }
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

    const formatted = formatQuestionsWithImages(req, questions);
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Помилка сервера: ' + err.message });
  }
};
