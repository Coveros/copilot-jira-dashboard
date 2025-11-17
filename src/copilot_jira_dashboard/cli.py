"""
Command-line interface for the Copilot-Jira Dashboard
"""

import argparse
import logging
import yaml
import sys
from pathlib import Path
from datetime import datetime, timedelta

from .collectors.copilot_collector import CopilotCollector
from .collectors.jira_collector import JiraCollector
from .analyzers.productivity_analyzer import ProductivityAnalyzer
from .visualizers.dashboard import DashboardVisualizer


def setup_logging(verbose: bool = False):
    """Setup logging configuration"""
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )


def load_config(config_path: str) -> dict:
    """Load configuration from YAML file"""
    try:
        with open(config_path, 'r') as f:
            config = yaml.safe_load(f)
        return config
    except Exception as e:
        logging.error(f"Error loading config: {e}")
        sys.exit(1)


def analyze_user(args):
    """Analyze a single user"""
    config = load_config(args.config)
    
    # Initialize collectors
    copilot = CopilotCollector(
        config['github']['token'],
        config['github']['organization']
    )
    jira = JiraCollector(
        config['jira']['url'],
        config['jira']['email'],
        config['jira']['token']
    )
    
    # Initialize analyzer
    analyzer = ProductivityAnalyzer(
        copilot, jira, config['analysis']
    )
    
    # Analyze user
    logging.info(f"Analyzing user: {args.username}")
    analysis = analyzer.analyze_user_productivity(
        args.username,
        args.jira_username
    )
    
    # Create visualizations
    visualizer = DashboardVisualizer(config['output']['reports_dir'])
    report_path = visualizer.create_user_dashboard(analysis, args.username)
    
    print(f"\n✓ Analysis complete!")
    print(f"  Report: {report_path}")
    print(f"  Charts: {config['output']['charts_dir']}")


def analyze_team(args):
    """Analyze a team of users"""
    config = load_config(args.config)
    
    # Load user mappings
    user_mappings = []
    if args.users_file:
        try:
            with open(args.users_file, 'r') as f:
                users_config = yaml.safe_load(f)
                user_mappings = users_config.get('users', [])
        except Exception as e:
            logging.error(f"Error loading users file: {e}")
            sys.exit(1)
    elif args.users:
        # Parse command line users
        for user_str in args.users:
            parts = user_str.split(':')
            github_user = parts[0]
            jira_user = parts[1] if len(parts) > 1 else github_user
            user_mappings.append({
                'github_username': github_user,
                'jira_username': jira_user
            })
    else:
        logging.error("Must provide either --users or --users-file")
        sys.exit(1)
    
    # Initialize collectors
    copilot = CopilotCollector(
        config['github']['token'],
        config['github']['organization']
    )
    jira = JiraCollector(
        config['jira']['url'],
        config['jira']['email'],
        config['jira']['token']
    )
    
    # Initialize analyzer
    analyzer = ProductivityAnalyzer(
        copilot, jira, config['analysis']
    )
    
    # Analyze team
    logging.info(f"Analyzing team of {len(user_mappings)} users")
    team_analysis = analyzer.analyze_team_productivity(user_mappings)
    
    # Create visualizations
    visualizer = DashboardVisualizer(config['output']['reports_dir'])
    
    # Create individual reports
    for analysis in team_analysis.get('individual_analyses', []):
        username = analysis.get('username')
        visualizer.create_user_dashboard(analysis, username)
    
    # Create team report
    report_path = visualizer.create_team_dashboard(team_analysis)
    
    print(f"\n✓ Team analysis complete!")
    print(f"  Team Report: {report_path}")
    print(f"  Individual Reports: {config['output']['reports_dir']}")
    print(f"  Charts: {config['output']['charts_dir']}")


def test_connection(args):
    """Test API connections"""
    config = load_config(args.config)
    
    print("Testing API connections...\n")
    
    # Test GitHub
    try:
        print("Testing GitHub API...")
        copilot = CopilotCollector(
            config['github']['token'],
            config['github']['organization']
        )
        seats = copilot.get_copilot_seats()
        print(f"✓ GitHub: Connected successfully ({len(seats)} Copilot seats)")
    except Exception as e:
        print(f"✗ GitHub: Connection failed - {e}")
    
    # Test Jira
    try:
        print("\nTesting Jira API...")
        jira = JiraCollector(
            config['jira']['url'],
            config['jira']['email'],
            config['jira']['token']
        )
        print(f"✓ Jira: Connected successfully to {config['jira']['url']}")
    except Exception as e:
        print(f"✗ Jira: Connection failed - {e}")


def main():
    """Main CLI entry point"""
    parser = argparse.ArgumentParser(
        description='GitHub Copilot and Jira Productivity Dashboard',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Analyze a single user
  %(prog)s analyze-user johndoe --config config.yml
  
  # Analyze a team from file
  %(prog)s analyze-team --users-file users.yml --config config.yml
  
  # Analyze a team from command line
  %(prog)s analyze-team --users johndoe janedoe:jane.doe --config config.yml
  
  # Test API connections
  %(prog)s test --config config.yml
        """
    )
    
    parser.add_argument(
        '--config', '-c',
        default='config.yml',
        help='Path to configuration file (default: config.yml)'
    )
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Enable verbose logging'
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Commands')
    
    # Analyze user command
    user_parser = subparsers.add_parser(
        'analyze-user',
        help='Analyze a single user'
    )
    user_parser.add_argument(
        'username',
        help='GitHub username'
    )
    user_parser.add_argument(
        '--jira-username',
        help='Jira username (if different from GitHub username)'
    )
    user_parser.set_defaults(func=analyze_user)
    
    # Analyze team command
    team_parser = subparsers.add_parser(
        'analyze-team',
        help='Analyze a team of users'
    )
    team_group = team_parser.add_mutually_exclusive_group(required=True)
    team_group.add_argument(
        '--users',
        nargs='+',
        help='List of users (format: github_user or github_user:jira_user)'
    )
    team_group.add_argument(
        '--users-file',
        help='YAML file with user mappings'
    )
    team_parser.set_defaults(func=analyze_team)
    
    # Test command
    test_parser = subparsers.add_parser(
        'test',
        help='Test API connections'
    )
    test_parser.set_defaults(func=test_connection)
    
    args = parser.parse_args()
    
    # Setup logging
    setup_logging(args.verbose)
    
    # Execute command
    if hasattr(args, 'func'):
        args.func(args)
    else:
        parser.print_help()


if __name__ == '__main__':
    main()
