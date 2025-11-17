# Contributing to Copilot-Jira Dashboard

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other contributors

## Getting Started

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/copilot-jira-dashboard.git
   cd copilot-jira-dashboard
   ```

3. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. Install in development mode:
   ```bash
   pip install -e .
   pip install pytest pytest-cov responses
   ```

5. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Guidelines

### Code Style

- Follow PEP 8 guidelines
- Use meaningful variable and function names
- Add docstrings to all public functions and classes
- Keep functions focused and single-purpose
- Maximum line length: 100 characters

Example:
```python
def calculate_engagement_score(metrics: Dict) -> float:
    """
    Calculate composite engagement score from user metrics
    
    Args:
        metrics: Dictionary containing user engagement data
        
    Returns:
        Engagement score between 0 and 100
    """
    # Implementation here
    pass
```

### Testing

- Write tests for all new functionality
- Maintain or improve code coverage
- Use pytest for testing
- Mock external API calls

Run tests:
```bash
pytest tests/ -v
```

With coverage:
```bash
pytest tests/ --cov=src/copilot_jira_dashboard --cov-report=html
```

### Commit Messages

Use clear, descriptive commit messages:
- Start with a verb in present tense
- Keep first line under 50 characters
- Add detailed description if needed

Good examples:
```
Add user engagement scoring algorithm
Fix Jira custom field detection
Update documentation for new features
```

### Pull Request Process

1. Update documentation for any new features
2. Add or update tests as needed
3. Ensure all tests pass
4. Update CHANGELOG.md if present
5. Create a pull request with a clear description

## Types of Contributions

### Bug Fixes

1. Search existing issues to avoid duplicates
2. Create an issue describing the bug
3. Reference the issue in your PR
4. Include steps to reproduce
5. Add a test that catches the bug

### New Features

Before starting work on a major feature:
1. Open an issue to discuss the feature
2. Wait for maintainer feedback
3. Follow the agreed-upon approach
4. Keep PRs focused and reasonably sized

Feature ideas:
- Additional data sources (Git commits, code reviews)
- More visualization types
- Database backend for historical tracking
- Web-based dashboard
- Additional correlation algorithms
- Export to different formats

### Documentation

Documentation improvements are always welcome:
- Fix typos or clarify existing docs
- Add examples and tutorials
- Improve API documentation
- Add diagrams or visualizations
- Translate to other languages

### Testing

Help improve test coverage:
- Add unit tests
- Add integration tests
- Add edge case tests
- Improve test documentation

## Project Structure

```
copilot-jira-dashboard/
├── src/copilot_jira_dashboard/
│   ├── collectors/      # API clients
│   ├── analyzers/       # Analysis logic
│   ├── visualizers/     # Report generation
│   └── cli.py           # CLI interface
├── tests/               # Test suite
├── docs/                # Documentation (future)
└── examples/            # Example configurations
```

## Adding a New Data Collector

1. Create new file in `src/copilot_jira_dashboard/collectors/`
2. Implement collector class with appropriate methods
3. Add tests in `tests/test_your_collector.py`
4. Update analyzer to use new data source
5. Update documentation

Example structure:
```python
class NewCollector:
    """Collects data from XYZ"""
    
    def __init__(self, config: Dict):
        """Initialize collector"""
        pass
    
    def get_data(self) -> List[Dict]:
        """Fetch data from source"""
        pass
```

## Adding a New Visualization

1. Add method to `DashboardVisualizer` class
2. Generate chart using matplotlib/seaborn
3. Integrate into HTML report template
4. Add example to documentation

## Questions?

- Open an issue for questions
- Check existing documentation
- Review closed issues and PRs

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Thanked in commit messages

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions help make this project better for everyone. We appreciate your time and effort! 🙏
