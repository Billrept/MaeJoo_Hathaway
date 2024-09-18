export default function handler(req, res) {
    if (req.method === 'POST') {
      const { title } = req.body;  // Get the data from the request body
  
      // Perform operations (e.g., save to a database or process data)
      // Example response back to the client
      res.status(200).json({ message: `Received title: ${title}` });
    } else {
      res.status(405).json({ message: 'Only POST method is allowed' });
    }
  }
  