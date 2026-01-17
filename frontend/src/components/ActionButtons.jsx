import { useState } from 'react';

/**
 * Quick Action Buttons Component
 * Provides fast access to all major app functions with alternating colors
 */
function ActionButtons({ onAction }) {
  // Alternating colors for buttons
  const colors = ['#EDF9D4', '#CEB1FB', '#BEEC7E'];

  const actions = [
    {
      id: 'health',
      label: 'Log Health',
      icon: '❤️',
      description: 'Track daily wellness',
      color: colors[0]
    },
    {
      id: 'weight',
      label: 'Log Weight',
      icon: '⚖️',
      description: 'Record weight',
      color: colors[1]
    },
    {
      id: 'treat',
      label: 'Log Treat',
      icon: '🦴',
      description: 'Track treats',
      color: colors[2]
    },
    {
      id: 'nutrition',
      label: 'Meal Plan',
      icon: '🍖',
      description: 'View nutrition',
      color: colors[0]
    },
    {
      id: 'activity',
      label: 'Activity',
      icon: '🏃',
      description: 'Log exercise',
      color: colors[1]
    },
    {
      id: 'vet',
      label: 'Vet Visit',
      icon: '🏥',
      description: 'Health records',
      color: colors[2]
    }
  ];

  const handleClick = (actionId) => {
    if (onAction) {
      onAction(actionId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleClick(action.id)}
            className="group relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95"
            style={{ backgroundColor: action.color }}
          >
            <span className="text-3xl mb-2">{action.icon}</span>
            <span className="text-sm font-semibold text-gray-800 text-center">
              {action.label}
            </span>
            <span className="text-xs text-gray-600 text-center mt-1">
              {action.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ActionButtons;
