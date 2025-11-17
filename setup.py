"""Setup script for copilot-jira-dashboard"""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

with open("requirements.txt", "r", encoding="utf-8") as fh:
    requirements = [line.strip() for line in fh if line.strip() and not line.startswith("#")]

setup(
    name="copilot-jira-dashboard",
    version="0.1.0",
    author="Coveros",
    description="Combine GitHub Copilot and Jira metrics to demonstrate developer productivity improvements",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/Coveros/copilot-jira-dashboard",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.8",
    install_requires=requirements,
    entry_points={
        "console_scripts": [
            "copilot-jira-dashboard=copilot_jira_dashboard.cli:main",
        ],
    },
)
