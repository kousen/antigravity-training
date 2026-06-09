import unittest
from calculator import add, subtract, multiply, divide

class TestCalculator(unittest.TestCase):
    def test_add(self):
        self.assertEqual(add(2, 3), 5)
        self.assertEqual(add(-1, 1), 0)
        self.assertEqual(add(-1, -1), -2)
        self.assertEqual(add(0, 0), 0)
        self.assertAlmostEqual(add(0.1, 0.2), 0.3)

    def test_subtract(self):
        self.assertEqual(subtract(5, 3), 2)
        self.assertEqual(subtract(3, 5), -2)
        self.assertEqual(subtract(-1, -1), 0)
        self.assertEqual(subtract(0, 0), 0)

    def test_multiply(self):
        self.assertEqual(multiply(2, 3), 6)
        self.assertEqual(multiply(-1, 3), -3)
        self.assertEqual(multiply(-1, -3), 3)
        self.assertEqual(multiply(5, 0), 0)

    def test_divide(self):
        self.assertEqual(divide(6, 3), 2.0)
        self.assertEqual(divide(-6, 3), -2.0)
        self.assertEqual(divide(-6, -3), 2.0)
        self.assertEqual(divide(5, 2), 2.5)

    def test_divide_by_zero(self):
        with self.assertRaises(ZeroDivisionError) as context:
            divide(5, 0)
        self.assertEqual(str(context.exception), "division by zero")

if __name__ == '__main__':
    unittest.main()
