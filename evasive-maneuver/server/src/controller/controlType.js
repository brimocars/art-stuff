let number = 0;

const controlType = async (req, res) => {
  try {
    number++;
    res.status(200).json({
      controlType: number % 2 === 0 ? 'vertical' : 'horizontal',
    });
  } catch (err) {
    console.error('Error with control type: ', err);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  controlType,
};